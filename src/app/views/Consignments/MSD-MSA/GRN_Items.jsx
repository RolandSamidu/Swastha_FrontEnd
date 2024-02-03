import React, { Component, Fragment } from "react";
import {
    Button,
    CardTitle,
    DatePicker,
    LoonsCard,
    LoonsTable,
    MainContainer,
    SubTitle
} from "../../../components/LoonsLabComponents";
import { CircularProgress, Grid, Tooltip, IconButton } from "@material-ui/core";
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { Autocomplete } from "@material-ui/lab";
import * as appConst from "../../../../appconst";
import Paper from "@material-ui/core/Paper";
import Buttons from "@material-ui/core/Button";
import VisibilityIcon from "@material-ui/icons/Visibility";
import ReceiptIcon from '@material-ui/icons/Receipt';
import ConsignmentService from "../../../services/ConsignmentService";
import localStorageService from "app/services/localStorageService";
import { dateParse } from "utils";
import GRNPrint from '../../MSD_Medical_Supply_Assistant/GrnPrint/index';
import GRNDonationPrint from '../../MSD_Medical_Supply_Assistant/GrnPrint/indexForDonation';
import LoonsButton from "app/components/LoonsLabComponents/Button";
import PrintIcon from '@material-ui/icons/Print';
import DonarService from "app/services/DonarService";
import HospitalConfigServices from "app/services/HospitalConfigServices";

class GRN_Items extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded: true,
            totalConsignment: 0,
            printLoad:false,
            printData:[],
            userName:null,
            items:[],
            itemIDs:[],
            warehouse:null,
            packData:[],
            pdata:[],
            grnItemIds:[],
            donation:false,
            supplier_data:{},

            totalItems: 0,
            filterData: {
                limit: 20,
                page: 0,
                delivery_date: null,
                agent: null,
                status: null,
                time_period: null,
                order_no: null,
                msa_id: null,
                'order[0]': ['updatedAt', 'DESC'],
            },
            data: [],
            columns: [
                {
                    name: 'GrnNo', // field name in the row object
                    label: 'GRN No', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.GRN?.grn_no
                                ;
                            return (
                                <p>{data}</p>
                            )
                        }
                    },
                },
                {
                    name: 'srNo', // field name in the row object
                    label: 'SR No', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.ItemSnapBatch?.ItemSnap?.sr_no
                                ;
                            return (
                                <p>{data}</p>
                            )
                        }
                    },
                },
                {
                    name: 'Item Name', // field name in the row object
                    label: 'Item Name', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.ItemSnapBatch?.ItemSnap?.medium_description
                                ;
                            return (
                                <p>{data}</p>
                            )
                        }
                    },
                },
                {
                    name: 'Batch', // field name in the row object
                    label: 'Batch', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.ItemSnapBatch?.batch_no
                                ;
                            return (
                                <p>{data}</p>
                            )
                        }
                    },
                },

                {
                    name: 'MFD', // field name in the row object
                    label: 'MFD', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.ItemSnapBatch?.mfd
                                ;
                            return (
                                <p>{dateParse(data)}</p>
                            )
                        }
                    },
                },
                {
                    name: 'exd', // field name in the row object
                    label: 'EXD', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.ItemSnapBatch?.exd
                                ;
                            return (
                                <p>{dateParse(data)}</p>
                            )
                        }
                    },
                },
                {
                    name: 'Pack Size', // field name in the row object
                    label: 'Pack Size', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.ItemSnapBatch?.pack_size
                                ;
                            return (
                                <p>{data}</p>
                            )
                        }
                    },
                },
                {
                    name: 'Unit Price', // field name in the row object
                    label: 'Unit Price', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.ItemSnapBatch?.unit_price
                                ;
                            return (
                                <p>{data}</p>
                            )
                        }
                    },
                },
                {
                    name: 'Order Qty', // field name in the row object
                    label: 'Order Qty', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.ConsignmentItemBatch?.quantity;
                            return (
                                <p>{data}</p>
                            )
                        }
                    },
                },
                {
                    name: 'Received Qty', // field name in the row object
                    label: 'Received Qty', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.quantity;
                            return (
                                <p>{data}</p>
                            )
                        }
                    },
                },
                {
                    name: 'Damage', // field name in the row object
                    label: 'Damage', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.damage;
                            return (
                                <p>{data}</p>
                            )
                        }
                    },
                },
                {
                    name: 'Shortage', // field name in the row object
                    label: 'Shortage', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.shortage;
                            return (
                                <p>{data}</p>
                            )
                        }
                    },
                },
                {
                    name: 'Excess', // field name in the row object
                    label: 'Excess', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.excess;
                            return (
                                <p>{data}</p>
                            )
                        }
                    },
                },
                {
                    name: 'status', // field name in the row object
                    label: 'Status', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true
                    },
                },


            ],
            alert: false,
            message: "",
            severity: 'success',
        }
    }

    async getPackingDetails(){
        console.log('testing IDs', this.state.itemIDs)
        
        let params = {
            search_type:'UOMS',
            consignment_item_id: this.state.itemIDs
        }

        let res = await ConsignmentService.getConsignmentItems(params)
        if (res.status === 200){
            console.log('packingdet-1', res.data.view.data)

            this.setState({
                packData:res.data.view.data
            })
        }
        
    }

    async getDonationPackingDetails() {
        
        let params = {
            // search_type:'UOMS',
            // consignment_item_id: this.state.grnItemIds
            donatation_item_batches: this.state.grnItemIds,       //donation item batch list
            'order[0]': ['package_qunatity', 'DESC'],
        }

        let res = await DonarService.getDonationDet(params)
        if (res.status === 200){
            console.log('packingdet-donation', res.data.view.data)

            this.setState({
                packData:res.data.view.data
            })
        }
        
    }


    async printGRN(){
        this.setState({
            printLoad:false
        })

        let filterData = {
            grn_id: this.props.match.params.id
        };

        let res = await ConsignmentService.getGRNItems(filterData)

        if (res.status === 200) {
            console.log('grn data item vise', res.data.view.data)
            this.dataMapping(res.data.view.data)
            // let pdata = res.data.view.data
            setTimeout(() => {
                this.setState({
                    pdata: res.data.view.data
                },()=>{
                    this.getPackDet()
                })
            }, 3000);
            
        }
        
    }


    // data map in another function 
    getPackDet() {
      
        if (!this.state.packData) {
          return;
        }

        // ddonation item
        if (this.state.donation == true){
            //   ------------------------------------------------------------------------------


            for (let index = 0; index < this.state.pdata.length; index++) {
                let element = this.state.pdata[index];
              
                let packingData = this.state.packData.filter(
                  (ele) => ele.item_id == element.ConsignmentItemBatch?.item_id
                );
              
                // Sort array by package quantity
                packingData.sort((a, b) => b.package_qunatity - a.package_qunatity);
              
                let highestQty = packingData[0].package_qunatity;
                let highestConversation = packingData[0].conversion;
              
                if (element.quantity % highestQty === 0) {
                  // element.quantity can be divided evenly by highestQty
                  let data = element.quantity / highestQty;
              
                  if (highestQty > 0 && data !== undefined && data !== null) {
                    // Assign packing details: highest value. conversation X element.qty
                    element.packingdetails = highestConversation + 'X' + Math.floor(data);
                  }
                } else {
                  let remainingQty = element.quantity;
                  let packingDetails = [];
              
                  for (let i = 0; i < packingData.length; i++) {
                    let currentLevelData = packingData[i];
              
                    if (remainingQty <= 0 ) {
                      break; // Stop dividing if remainingQty is 0 or lowest level reached
                    }
              
                    let currentLevelQty = Math.floor(remainingQty / currentLevelData.package_qunatity);
                    remainingQty %= currentLevelData.package_qunatity;
              
                    if (currentLevelQty > 0) {
                      packingDetails.push(currentLevelData.conversion + 'X' + currentLevelQty);
                    }
                  }
              
                  if (remainingQty > 0) {
                    // Check if there is a lower level available
                    let lowerLevelData = packingData.find((data) => data.package_quantity === packingData[1].package_quantity);
                    // console.log('testing-highestConversation', highestConversation);
              
                    if (lowerLevelData) {
                      let data = remainingQty / lowerLevelData.package_quantity;
                      packingDetails.push(lowerLevelData.conversion + 'X' + Math.floor(data));
                    }
                  }
              
                  if (packingDetails.length > 0) {
                    element.packingdetails = packingDetails.join(', ');
                  }
                }
              }

        } else {

            for (let index = 0; index < this.state.pdata.length; index++) {
                let element = this.state.pdata[index];
              
                let packingData = this.state.packData.filter(
                  (ele) => ele.item_id == element.ConsignmentItemBatch?.item_id
                );
              
                // Sort array by level
                packingData.sort((a, b) => b.level - a.level);
              
                let highestLevel = packingData[0].level;
                let highestQty = packingData[0].quantity;
                let highestConversation = packingData[0].conversation;
              
                if (element.quantity % highestQty === 0) {
                  // element.quantity can be divided evenly by highestQty
                  let data = element.quantity / highestQty;
              
                  if (highestQty > 0 && data !== undefined && data !== null) {
                    // Assign packing details: highest value. conversation X element.qty
                    element.packingdetails = highestConversation + 'X' + Math.floor(data);
                  }
                } else {
                  let remainingQty = element.quantity;
                  let packingDetails = [];
              
                  for (let i = 0; i < packingData.length; i++) {
                    let currentLevelData = packingData[i];
              
                    if (remainingQty <= 0 || currentLevelData.level === 1) {
                      break; // Stop dividing if remainingQty is 0 or lowest level reached
                    }
              
                    let currentLevelQty = Math.floor(remainingQty / currentLevelData.quantity);
                    remainingQty %= currentLevelData.quantity;
              
                    if (currentLevelQty > 0) {
                      packingDetails.push(currentLevelData.conversation + 'X' + currentLevelQty);
                    }
                  }
              
                  if (remainingQty > 0) {
                    // Check if there is a lower level available
                    let lowerLevelData = packingData.find((data) => data.level === highestLevel - 1);
              
                    if (lowerLevelData) {
                      let data = remainingQty / lowerLevelData.quantity;
                      packingDetails.push(lowerLevelData.conversation + 'X' + Math.floor(data));
                    }
                  }
              
                  if (packingDetails.length > 0) {
                    element.packingdetails = packingDetails.join(', ');
                  }
                }
              }
        }

      
        this.setState(
          {
            printLoad: true,
            printData: this.state.pdata, // Assign modified pdata array to printData
          },()=>{
            this.getSupplierInfo()
          }
        )
      }

      async getSupplierInfo(){
        console.log('checling supplier info - print data', this.state.printData)
        let id = this.state.printData?.[0]?.GRN?.Consignment?.supplier_id
        console.log('called') 

        let res = await HospitalConfigServices.getAllSupplierByID(id)
        
        if (res.status === 200){       
            console.log('checling supplier info', res)
            
            this.setState({
                supplier_data:res.data.view,
                load:true
            })     
            // console.log('checling supplier info - name', this.state.supplier?.name)     
        }

        this.render();
        if (this.state.donation == true){
            // donation print
            document.getElementById('print_presc_02').click();
        } else{
            document.getElementById('print_presc_01').click();
        }
    
    }
    
      

    async dataMapping(data) {
        console.log('dataContent_data',data)
        let array = []
        let ItemIDlist = null
        let grnUniquitemIDlist = null
        let uniquitemIDlist = null

        
        let itemslist = data.map((dataset) => dataset.ItemSnapBatch.ItemSnap.id)
        let uniquitemslist = [...new Set(itemslist)]

        data.map((dataContent)=>{
            
            if (dataContent?.GRN?.type === 'Donation GRN') {
                // if item is donation
                ItemIDlist = data.map((dataset) => dataset.donation_item_batch_id)
                grnUniquitemIDlist = [...new Set(ItemIDlist)]
                this.setState({
                    donation:true
                })
            } else {
                ItemIDlist = data.map((dataset) => dataset.ConsignmentItemBatch?.item_id ?? dataset.DonationItemsBatch?.DonationItem?.item_id)
                uniquitemIDlist = [...new Set(ItemIDlist)]
                this.setState({
                    donation:false
                })
            }
            
        })

        console.log('uniquitemIDlist',uniquitemIDlist)
        console.log('grnUniquitemIDlist',grnUniquitemIDlist)

        this.setState({
            items: uniquitemslist,
            itemIDs:uniquitemIDlist,
            grnItemIds:grnUniquitemIDlist,
            Loaded: true,
        },()=>{
            if(this.state.donation == true) {
                this.getDonationPackingDetails()
            } else {
                this.getPackingDetails()
            }
            
        })
    }


    async loadData() {
        this.setState({ loaded: false })

        var user = await localStorageService.getItem('userInfo');
        let filterData = {
            grn_id: this.props.match.params.id,
            page:this.state.filterData.page,
            limit:20,
        };
        //filterData.msa_id = user.id;


        let res = await ConsignmentService.getGRNItems(filterData)
        if (res.status == 200) {
            this.setState(
                {
                    loaded: true,
                    data: res.data.view.data,
                    totalItems: res.data.view.totalItems,
                    // totalPages: res.data.view.totalPages,
                },
                () => {
                    this.render()
                }
            )
        }

    }

    async getUserInfo(){
        var user = await localStorageService.getItem('userInfo');

        this.setState({
            userName:user.name
        })
    }

    async getWarehouseInfo(){
        var selected_warehouse = await localStorageService.getItem(
            'Selected_Warehouse'
        )

       console.log('selected_warehouse', selected_warehouse?.name)

       this.setState({
        warehouse:selected_warehouse?.name
       })
    }

    componentDidMount() {
        this.loadData();
        this.getUserInfo()
        this.getWarehouseInfo()
    }

    handleFilterSubmit = (val) => {
        this.loadData()
    }




    async setPage(page) {
        let filterData = this.state.filterData
        filterData.page = page
        this.setState(
            {
                filterData,
            },
            () => {
                this.loadData()
            }
        )
    }

    render() {
        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        <CardTitle title=" GRN Items " />

                        <Grid container className="mt-5">
                            <Grid xs={12} item style={{textAlign:'right'}}>
                                <LoonsButton 
                                    onClick={()=>{
                                        this.printGRN()
                                    }}
                                >
                                    <PrintIcon></PrintIcon> Print  
                                </LoonsButton>
                            </Grid>
                        </Grid>

                        <Grid lg={12} className=" w-full mt-2" spacing={2} style={{ marginTop: 20 }}>

                            {
                                this.state.loaded ?
                                    <div className="pt-0">
                                        <LoonsTable
                                            id={"GRN_items"}
                                            data={this.state.data}
                                            columns={this.state.columns}
                                            options={{
                                                pagination: true,
                                                serverSide: true,
                                                count: this.state.totalItems,
                                                rowsPerPage: this.state.filterData.limit,
                                                page: this.state.filterData.page,
                                                rowsPerPageOptions: [5, 10, 15, 20, 30, 50, 100],
                                                onTableChange: (action, tableState) => {
                                                    switch (action) {
                                                        case 'changePage':
                                                            this.setPage(tableState.page)
                                                            break;
                                                        case 'changeRowsPerPage':
                                                            let formaData = this.state.filterData;
                                                            formaData.limit = tableState.rowsPerPage;
                                                            this.setState({ formaData })
                                                            this.setPage(0)
                                                            break;
                                                        case 'sort':
                                                            break;
                                                        default:
                                                            console.log('action not handled.');
                                                    }
                                                }

                                            }
                                            }
                                        >
                                        </LoonsTable>
                                    </div>
                                    :
                                    <Grid className="justify-center text-center w-full pt-12">
                                        <CircularProgress size={30} />
                                    </Grid>
                            }
                        </Grid>
                        { this.state.printLoad?
                        <Grid>
                            <GRNPrint printData={this.state.printData}  supplier_data={this.state.supplier_data}  userName={this.state.userName} items={this.state.items} warehouse={this.state.warehouse}></GRNPrint>
                            <GRNDonationPrint printData={this.state.printData} supplier_data={this.state.supplier_data}  userName={this.state.userName} items={this.state.items} warehouse={this.state.warehouse}></GRNDonationPrint>
                        </Grid>
                        
                        : null}
                    </LoonsCard>
                </MainContainer>
            </Fragment>
        );
    }
}

export default GRN_Items
