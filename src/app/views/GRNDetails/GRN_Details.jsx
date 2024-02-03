import React, { Component, Fragment } from "react";
import {
    Button,
    CardTitle,
    DatePicker,
    LoonsCard,
    LoonsTable,
    MainContainer,
    SubTitle
} from "app/components/LoonsLabComponents";
import { CircularProgress, Grid, InputAdornment, IconButton } from "@material-ui/core";
import ConsignmentService from "app/services/ConsignmentService";
import localStorageService from "app/services/localStorageService";
import { dateParse } from "utils";
import GRNPrint from '../MSD_Medical_Supply_Assistant/GrnPrint/index';    //../../MSD_Medical_Supply_Assistant/GrnPrint/index
import GRNDonationPrint from '../MSD_Medical_Supply_Assistant/GrnPrint/indexForDonation';   //../../MSD_Medical_Supply_Assistant/GrnPrint/indexForDonation
import LoonsButton from "app/components/LoonsLabComponents/Button";
import PrintIcon from '@material-ui/icons/Print';
import DonarService from "app/services/DonarService";
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents';
import SearchIcon from '@material-ui/icons/Search'
import { Autocomplete } from '@material-ui/lab';
import WarehouseServices from "app/services/WarehouseServices";
import LoonsDatePicker from "app/components/LoonsLabComponents/DatePicker";

class GRN_Details extends Component {
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
            date_selection: true,

            drug_store:null,

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
                search:null,
                'order[0]': ['updatedAt', 'DESC'],
                to: null,
                from_date:null,
                to_date:null,
                date_type:null,
                
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
                    name: 'orderNo', // field name in the row object
                    label: 'Order No', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            // console.log('oder det data', this.state.data[dataIndex]?.GRN?.Consignment?.order_no)
                            let data = this.state.data[dataIndex]?.GRN?.Consignment?.order_no
                                
                            return (
                                <p>{data}</p>
                            )
                        }
                    },
                },
                {
                    name: 'po', // field name in the row object
                    label: 'PO', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            // console.log('oder det data', this.state.data[dataIndex]?.GRN?.Consignment?.order_no)
                            let data = this.state.data[dataIndex]?.GRN?.Consignment?.po
                                
                            return (
                                <p>{data}</p>
                            )
                        }
                    },
                },
                {
                    name: 'type', // field name in the row object
                    label: 'Type', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.GRN?.type
                                
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
                    name: 'ad', // field name in the row object
                    label: 'Added Date', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            // console.log('oder det data', this.state.data[dataIndex]?.GRN?.Consignment?.order_no)
                            let data = dateParse(this.state.data[dataIndex]?.GRN?.updatedAt)
                                
                            return (
                                <p>{data}</p>
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
                    label: 'Minimum Pack Size', // column title that will be shown in table
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
                // {
                //     name: 'status', // field name in the row object
                //     label: 'Status', // column title that will be shown in table
                //     options: {
                //         filter: false,
                //         display: true
                //     },
                // },


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


    // async printGRN(){
    //     this.setState({
    //         printLoad:false
    //     })

    //     let filterData = this.state.filterData
    //     filterData.grn_id = this.props.match.params.id
    //     filterData.status = 'COMPLETED'

    //     // let filterData = {
    //     //     grn_id: this.props.match.params.id
    //     // };

    //     let res = await ConsignmentService.getGRNItems(filterData)

    //     if (res.status === 200) {
    //         console.log('grn data item vise', res.data.view.data)
    //         this.dataMapping(res.data.view.data)
    //         // let pdata = res.data.view.data
    //         setTimeout(() => {
    //             this.setState({
    //                 pdata: res.data.view.data
    //             },()=>{
    //                 this.getPackDet()
    //             })
    //         }, 3000);
            
    //     }
        
    // }


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
          },
          () => {
            this.render();
            if (this.state.donation == true){
                // donation print
                document.getElementById('print_presc_02').click();
            } else{
                document.getElementById('print_presc_01').click();
            }
            
          }
        );
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

        var user = await localStorageService.getItem('owner_id');

        console.log('user info', user)
        let filterData = this.state.filterData
        filterData.status = 'COMPLETED'
        filterData.type  = ['Consignment GRN','Donation GRN']
        filterData.owner_id = user

        let res = await ConsignmentService.getGRNItems(filterData)
        if (res.status == 200) {
            console.log('res.data.view.data', res.data.view.data)
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

    async loadWarehouses() {

        var user = await localStorageService.getItem('owner_id');

        let data = {
            // type: "MSD",
            owner_id: user
        }
        let warehouses = await WarehouseServices.getWarehoure(data)
        if (warehouses.status == 200) {
            console.log('Warehouses', warehouses.data.view.data)
            this.setState(
                { all_pharmacy: warehouses.data.view.data, all_drug_stores: warehouses.data.view.data }
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
        this.loadWarehouses()
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
                        <CardTitle title="Newly Arrived Items" />

                                        <ValidatorForm onSubmit={() => this.setPage(0)} onError={() => null}>
                                            <Grid container="container" spacing={2} className='mt-5'>
                                           
                                            <Grid item="item"  lg={4} md={4} sm={12} xs={12}>
                                            <SubTitle title="Warehouse"/>
                                                <Autocomplete
                                                        disableClearable className="w-full" 
                                                        options={this.state.all_drug_stores} 
                                                        onChange={(e, value) => {
                                                        if (value != null) {
                                                            let formData = this.state.filterData
                                                            formData.to = value.id
                                                                this.setState({formData, drug_store:value.name})
                                                        }
                                                    }}
                                                    /*  defaultValue={this.state.all_district.find(
                                                    (v) => v.id == this.state.formData.district_id
                                                    )} */
                                                    // value={this.state.drug_store} 
                                                        getOptionLabel={(
                                                        option) => option.name
                                                        ? option.name
                                                        : ''} 
                                                        renderInput={(params) => (
                                                            <TextValidator {...params} placeholder="Warehouse"
                                                            //variant="outlined"
                                                            fullWidth="fullWidth" variant="outlined" size="small"/>
                                                    )}/>
                                            </Grid>
                                            
                                            <Grid item lg={4} md={4} sm={4} xs={4} >
                                            <SubTitle title={"Date Range"}></SubTitle>
                                            <Autocomplete
                                                        disableClearable
                                                className="w-full"
                                                options={[{ label: "Requested Date", value: "REQUESTED DATE" }, { label: "Required Date", value: "REQUIRED DATE" }, { label: "Allocated Date", value: "ALLOCATED DATE" }, { label: "Issued Date", value: "ISSUED DATE" }, { label: "Received Date", value: "RECEIVED DATE" }]}
                                                /*  defaultValue={dummy.find(
                                                     (v) => v.value == ''
                                                 )} */
                                                getOptionLabel={(option) => option.label}
                                                getOptionSelected={(option, value) =>
                                                    console.log("ok")
                                                }
                
                                                onChange={(event, value) => {
                                                    let formData = this.state.filterData
                                                    if (value != null) {
                                                        formData.date_type = value.value
                                                        this.setState({date_selection: false })
                                                    } else {
                                                        formData.date_type = null
                                                        formData.to_date = null
                                                        formData.from_date = null
                                                        this.setState({date_selection: true })
                                                    }
                                                    this.setState({ formData})
                                                }}
                
                                                renderInput={(params) => (
                                                    <TextValidator
                                                        {...params}
                                                        placeholder="Date Range"
                                                        //variant="outlined"
                                                        //value={}
                                                        fullWidth
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        variant="outlined"
                                                        size="small"
                                                        // validators={[
                                                        //     'required',
                                                        // ]}
                                                        // errorMessages={[
                                                        //     'this field is required',
                                                        // ]}
                                                    />
                                                )}
                                            />
                                            
                
                                        </Grid>
                
                                            <Grid item="item" lg={4} md={4} sm={12} xs={12}>
                                                <SubTitle title="From"/>
                                                <LoonsDatePicker className="w-full" value={this.state.formData?.from_date} placeholder="From"
                                                    // minDate={new Date()}
                                                    //maxDate={new Date()}
                                                    // required={!this.state.date_selection}
                                                    disabled={this.state.date_selection}
                                                    // errorMessages="this field is required"
                                                    onChange={(date) => {
                                                        let formData = this.state.filterData
                                                        formData.from_date = dateParse(date)
                                                        this.setState({formData})
                                                    }}/>
                                            </Grid>
                                            <Grid item="item" lg={4} md={4} sm={12} xs={12}>
                                                <SubTitle title="To"/>
                                                <LoonsDatePicker className="w-full" value={this.state.filterData?.to_date} placeholder="To"
                                                   minDate={this.state.formData?.from_date}
                                                    //maxDate={new Date()}
                                                    // required={!this.state.date_selection}
                                                    disabled={this.state.date_selection}
                                                    // errorMessages="this field is required"
                                                    onChange={(date) => {
                                                        let formData = this.state.formData
                                                        formData.to_date = dateParse(date)
                                                        this.setState({formData})
                                                    }}/>
                                            </Grid>
                                            <Grid
                                                item="item"
                                                lg={4} md={4} sm={12} xs={12}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'flex-end'
                                                }}>
                                                <LoonsButton type="submit"
                                                    //onClick={this.handleChange}
                                                >
                                                    <span className="capitalize">Filter</span>
                                                </LoonsButton>
                                            </Grid>

                                            <Grid lg={4} md={4} sm={12} xs={12} item className="mt-4">
                                                <div >
                                                    <TextValidator
                                                        className="w-full"
                                                        placeholder="Search"
                                                        //variant="outlined"
                                                        fullWidth="fullWidth"
                                                        variant="outlined"
                                                        size="small"
                                                        // value={
                                                        //     this.state.filterData.search
                                                        // }
                                                        onChange={(e, value) => {
                                                            let filterData = this.state.filterData
                                                            filterData.search = e.target.value
                                                            this.setState({
                                                                filterData,
                                                            })
                                                            console.log(
                                                                'form data',
                                                                this.state.filterData
                                                            )
                                                        }}
                                                        InputProps={{
                                                            endAdornment: (
                                                                <InputAdornment position="end" onClick={()=>this.setPage(0)}>
                                                                    <SearchIcon></SearchIcon>
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    />
                                </div>

                            </Grid>
                                            
                            </Grid>
                                </ValidatorForm>


                        {/* <Grid container>
                            <Grid xs={12} md={4} item style={{textAlign:'right'}}>

                            </Grid>
                            <Grid xs={12} item style={{textAlign:'right'}}>
                                <LoonsButton 
                                    onClick={()=>{
                                        this.printGRN()
                                    }}
                                >
                                    <PrintIcon></PrintIcon> Print  
                                </LoonsButton>
                            </Grid>
                        </Grid> */}

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
                            <GRNPrint printData={this.state.printData}  userName={this.state.userName} items={this.state.items} warehouse={this.state.warehouse}></GRNPrint>
                            <GRNDonationPrint printData={this.state.printData}  userName={this.state.userName} items={this.state.items} warehouse={this.state.warehouse}></GRNDonationPrint>
                        </Grid>
                        
                        : null}
                    </LoonsCard>
                </MainContainer>
            </Fragment>
        );
    }
}

export default GRN_Details
