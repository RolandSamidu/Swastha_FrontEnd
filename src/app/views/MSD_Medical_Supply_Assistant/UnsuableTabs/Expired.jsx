import {CircularProgress, Dialog, Divider, Grid, InputAdornment, Typography,FormControlLabel,Radio ,Tooltip,Icon,IconButton,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { CardTitle, LoonsCard, LoonsSnackbar, LoonsTable, MainContainer, SubTitle, Button } from "app/components/LoonsLabComponents";
import LoonsButton from "app/components/LoonsLabComponents/Button";
import React, { Fragment } from "react";
import { Component } from "react";
import SearchIcon from '@material-ui/icons/Search';
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import GroupSetupService from 'app/services/datasetupServices/GroupSetupService';
import CategoryService from 'app/services/datasetupServices/CategoryService';
import ClassDataSetupService from 'app/services/datasetupServices/ClassDataSetupService';
import WarehouseServices from '../../../services/WarehouseServices';
import PharmacyOrderService from 'app/services/PharmacyOrderService';
import ApartmentIcon from '@material-ui/icons/Apartment';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import localStorageService from 'app/services/localStorageService';
import { dateParse } from "utils";
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import FeedIcon from '@mui/icons-material/Feed';

class Expired extends Component {

    constructor(props) {
        super(props)
        this.state = {
            updateData: {
                noOfDays: 0
            },
            alert: false,
            message: '',
            severity: 'success',
            

            formData: {
                item_id: null,
                description: null,
                store_quantity: null,
                lessStock: null,
                moreStock: null,
                page: 0,
                limit: 25,
                warehouse_id: null,
                exp_date_order: true,
                orderby_drug:true,
                orderby_sr : true,
                // item_main_status:this.props.status,
                // exp_date_grater_than_zero_search:'false',
                // quantity_grater_than_zero_search:'false',
                search: null,
                // item_status:null
            },
            //return process
            returnDialog:false,
            returnQuantity:null,
            currentAvailableqty:null,
            drugStoreData:[],
            selected_ds:null,
            remarks:[],
            remarkID:null,
            otherRemark:null,
            currentStock:null,
            itemQuantity:null,            

            all_ven: [],
            all_item_class: [],
            all_item_category: [],
            all_item_group: [],
            loaded: true,
            totalItems: 0,
            selectWarehouseView: false,
            warehouse_loaded: false,
            selectedWarehouse: null,
            allWarehouses: [],
            columns: [
                {
                    name: 'action',
                    label: 'Actions',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let id = this.state.data[dataIndex]?.ItemSnapBatch?.ItemSnap?.id
                            let batch_id = this.state.data[dataIndex]?.item_batch_id
                            return (
                                <Grid container={2}>
                                  
                                    <Grid item>
                                        <Tooltip title="Stock Movement">
                                            <IconButton
                                                onClick={() => {
                                                    window.location = `/drugbalancing/checkStock/detailedview/${id}?batch_id=${batch_id}`

                                                    // /${this.state.data[tableMeta.rowIndex].item_batch_id}
                                                    // ?from=${this.state.filterData.from}
                                                    // &to=${this.state.filterData.to}
                                                    // &batch_id=${this.state.data[tableMeta.rowIndex].batch_id} 
                                                }}
                                                className="px-2"
                                                size="small"
                                                aria-label="View Item Stocks"
                                            >
                                                <FeedIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                   
                                </Grid>
                            )
                        },
                    },
                },
                {
                    name: 'ItemSnap', // field name in the row object
                    label: 'SR Number', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log("tableMeta", tableMeta);
                            let cellData = this.state.data[tableMeta.rowIndex].ItemSnapBatch?.ItemSnap?.sr_no;
                            if (cellData == null) {
                                return 'N/A'
                            } else {
                                return (cellData)
                            }
                        }
                    }
                },
                // {
                //     name: 'item_id', // field name in the row object
                //     label: 'Item Code', // column title that will be shown in table
                //     options: {
                //         filter: true,
                //         display: true,
                //         width: 10
                //     }
                // },
                {
                    name: 'ItemSnap', // field name in the row object
                    label: 'Item Name', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log("tableMeta", tableMeta);
                            let cellData = this.state.data[tableMeta.rowIndex].ItemSnapBatch?.ItemSnap?.medium_description;
                            if (cellData == null) {
                                return 'N/A'
                            } else {
                                return (cellData)
                            }
                        }
                    }
                },
                {
                    name: 'batch_no', // field name in the row object
                    label: 'Batch No', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log("tableMeta", tableMeta);
                            let cellData = this.state.data[tableMeta.rowIndex].ItemSnapBatch?.batch_no;
                            if (cellData == null) {
                                return 'N/A'
                            } else {
                                return (cellData)
                            }
                        }
                    }
                },
                {
                    name: 'EXD', // field name in the row object
                    label: 'EXD', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log("tableMeta", tableMeta);
                            let cellData = this.state.data[tableMeta.rowIndex].ItemSnapBatch?.exd;
                            if (cellData == null) {
                                return 'N/A'
                            } else {
                                return (dateParse(cellData))
                            }
                        }
                    }
                },
                {
                    name: 'quantity', // field name in the row object
                    label: 'Quantity', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log("tableMeta", tableMeta);
                            let cellData = this.state.data[tableMeta.rowIndex].quantity;
                            if (cellData == null) {
                                return 'N/A'
                            } else {
                                return (Math.floor(cellData))
                            }
                        }
                    }
                },
                {
                    name: 'actions',
                    label: 'Actions',
                    options: { 
                        display: ((this.props.status === 'Batch Withdraw' || this.props.status === 'Item Withdraw'? true:false)),
                        customBodyRender: (value, tableMeta, updateValue) => {
// {this.props.status == 'Batch Withdraw'||this.props.status == 'Item Withdraw'}
                            return (

                                //  (parseInt(this.state.data[tableMeta.rowIndex].OrderItem.recieved_quantity)) < (parseInt(this.state.data[tableMeta.rowIndex].allocated_quantity)) ?
                                //     (
                                <>
                                        <Tooltip title="Return">
                                            <IconButton
                                                className="text-black mr-1"
                                                // disabled={this.state.data[tableMeta.rowIndex].status === 'RECIEVED' ? true : false}
                                                onClick={() => {
                                                    this.LoadCurrentStockLevel(this.state.data[tableMeta.rowIndex].ItemSnapBatchBin?.ItemSnapBatch?.id)
                                                    this.loadDrugStoreData()
                                                    console.log("return", this.state.data[tableMeta.rowIndex])
                                                    this.setState({
                                                        returnDialog: true,
                                                        itemQuantity:this.state.data[tableMeta.rowIndex].quantity,
                                                        // totalReceivedItems: this.state.data[tableMeta.rowIndex].OrderItem.recieved_quantity,
                                                        // ReceivedItemID: this.state.data[tableMeta.rowIndex].order_item_id,
                                                        selected_order_item: this.state.data[tableMeta.rowIndex],
                                                        // AddReceivedItems: parseInt(this.state.data[tableMeta.rowIndex]?.allocated_quantity)
                                                    })

                                                }}
                                            >
                                                <KeyboardReturnIcon >Return</KeyboardReturnIcon>

                                            </IconButton>
                                        </Tooltip>

                                </>
                            )
                        },
                    },
                },




            ],
            data: []

        }
    }
    async loadDrugStoreData() {
        //Fetch department data
        // let res = await PharmacyService.fetchAllDataStorePharmacy('001', {})
        let owner_id = await localStorageService.getItem('owner_id')
        let userInfo = await localStorageService.getItem('userInfo')

        if (userInfo.roles.includes('RMSD MSA') || userInfo.roles.includes('RMSD Distribution Officer')) {
            owner_id = null
        }

        let res = await WarehouseServices.getAllWarehousewithOwner({ store_type: 'drug_store' }, owner_id)
        console.log("warehouses", res)
        if (200 == res.status) {
            this.setState({
                drugStoreData: res.data.view.data,
            })
            console.log("this.state.drugStoreData", this.state.drugStoreData);
        }
        let res2 = await PharmacyOrderService.getRemarks()
        if (res2.status == 200) {
            let remarks = [...res2.data.view.data, { remark: 'Other' }]
            this.setState({
                remarks: remarks,
                // loaded: true
            })
            return;
        }
    }
    async LoadCurrentStockLevel(id) {
        let data = {
            warehouse_id:await localStorageService.getItem("Selected_Warehouse").id,
            item_batch_id:id,
            // to:this.props.toStore.id
        }
        // console.log("this.props.match.params.id",this.props.match.params.id);
        let res = await WarehouseServices.getSingleItemWarehouse(data)
        if (res.status) {
            console.log("stock Data", res.data.view.data[0])
            this.setState({
                currentStock: res.data.view.data[0].quantity,
                // returnDialog: true,
            })
        }

    }



    async loadData() {
        //function for load initial data from backend or other resources
        let ven_res = await WarehouseServices.getVEN({ limit: 99999 })
        if (ven_res.status == 200) {
            console.log('Ven', ven_res.data.view.data)
            this.setState({ all_ven: ven_res.data.view.data })
        }
        let cat_res = await CategoryService.fetchAllCategories({ limit: 99999 })
        if (cat_res.status == 200) {
            console.log('Categories', cat_res.data.view.data)
            this.setState({ all_item_category: cat_res.data.view.data })
        }
        let class_res = await
            ClassDataSetupService.fetchAllClass({ limit: 99999 })
        if (class_res.status == 200) {
            console.log('Classes', class_res.data.view.data)
            this.setState({ all_item_class: class_res.data.view.data })
        }
        let group_res = await GroupSetupService.fetchAllGroup({ limit: 99999 })
        if (group_res.status == 200) {
            console.log('Groups', group_res.data.view.data)
            this.setState({ all_item_group: group_res.data.view.data })
        }
    }

    async loadOrderList() {
        this.setState({ loaded: false, cartStatus: [] })
        let formData = this.state.formData
        let login_user_info = await localStorageService.getItem('userInfo')
        let user_role=login_user_info.roles

        let warehouse_id = await localStorageService.getItem('Selected_Warehouse')?.id
        let owner_id = await localStorageService.getItem('owner_id')
        
        if(login_user_info.roles.includes('Drug Store Keeper') ||
        login_user_info.roles.includes('Store Keeper') ||
        login_user_info.roles.includes('RMSD Distribution Officer') ||
        login_user_info.roles.includes('Drugstore Pharmacist(S)') ||
        login_user_info.roles.includes('Blood Bank Consultant') ||
        login_user_info.roles.includes('Blood Bank MLT (NOIC)') ||
        login_user_info.roles.includes('Blood Bank MLT') ||

        login_user_info.roles.includes('Chief MLT') ||
        login_user_info.roles.includes('RMSD ADMIN') ||
        login_user_info.roles.includes('RMSD MSA') ||
        login_user_info.roles.includes('RMSD Pharmacist') ||
        login_user_info.roles.includes('RMSD OIC') ||
        login_user_info.roles.includes('MSD MSA') ||
        login_user_info.roles.includes('Pharmacist') ||
        login_user_info.roles.includes('Counter Pharmacist') ||
        login_user_info.roles.includes('Dispenser') ||
        login_user_info.roles.includes('Admin Pharmacist') ||
        login_user_info.roles.includes('Medical Laboratory Technologist') ||
        login_user_info.roles.includes('Radiographer')){
            formData.warehouse_id = warehouse_id
        }
        if(user_role == 'Chief Pharmacist'|| user_role == 'Hospital Director'){
            formData.owner_id = owner_id
        }
        if(user_role.includes('MSD SCO')||user_role.includes('MSD SCO Distribution')||user_role.includes('MSD SCO QA')
        ||user_role.includes('MSD SCO Supply')||user_role.includes('MSD Distribution Officer')
        ||user_role.includes('Distribution Officer')
         ){
            formData.owner_id = '000'
            formData.distribution_officer_id= login_user_info.id
        }

        if(this.props.status == 'Expired Drugs'){
            formData.expired = true
            // formData.item_status=null
        } else if(this.props.status == 'Batch Withdraw'){
            formData.item_status=['Withdraw']
            
        }
        else if(this.props.status == 'Batch Withhold'){
            formData.item_status=['Withhold','Temporary Withhold']
        }
        else if(this.props.status == 'Item Withdraw'){
            formData.item_status=['Product Withdraw']
            
        }
        else if(this.props.status == 'Item Withhold'){
            formData.item_status=['Product Withhold'] 
        }
        else if(this.props.status == 'Under Serveilance'){
            formData.item_status=["Under Serveilance"] 
        }
        console.log('data2',formData)
        let res = await WarehouseServices.getSingleItemWarehouse(this.state.formData)
        if (res.status) {

            console.log("data", res.data.view.data);
            this.setState({
                data: res.data.view.data,
                loaded: true,
                totalItems: res.data.view.totalItems
            }, () => {
                this.render()
                // this.getCartItems()
            })
        }
    }

    async setPage(page) {
        //Change paginations
        let formData = this.state.formData
        formData.page = page
        this.setState({
            formData
        }, () => {
            console.log("New formdata", this.state.formData)
            this.loadOrderList()
        })
    }



    async loadWarehouses() {
        this.setState({
            warehouse_loaded: false
        })
        var user = await localStorageService.getItem('userInfo');
        console.log('user', user)
        var id = user.id;
        var all_pharmacy_dummy = [];
        var selected_warehouse_cache = await localStorageService.getItem('Selected_Warehouse');
        if (!selected_warehouse_cache) {
            this.setState({
                selectWarehouseView: true
            })
        }
        else {
            this.state.formData.warehouse_id = selected_warehouse_cache.id
            this.setState({
                selectWarehouseView: false,
                warehouse_loaded: true
            })
        }
        let params = { employee_id: id }
        let res = await WarehouseServices.getWareHouseUsers(params);
        if (res.status == 200) {
            console.log("CPALLOders", res.data.view.data)

            res.data.view.data.forEach(element => {
                all_pharmacy_dummy.push(
                    {
                        warehouse: element.Warehouse,
                        name: element.Warehouse.name,
                        main_or_personal: element.Warehouse.main_or_personal,
                        owner_id: element.Warehouse.owner_id,
                        id: element.warehouse_id,
                        pharmacy_drugs_stores_id: element.Warehouse.pharmacy_drugs_store_id,
                    }

                )
            });
            console.log("warehouse", all_pharmacy_dummy)
            this.setState({
                allWarehouses: all_pharmacy_dummy
            })
        }
    }

    componentDidMount() {
        let status = this.props.status
        console.log("status",status)
        console.log("props",this.props)
        // this.loadWarehouses();
        // this.load_days(31)  
        //this.loadData()
        this.loadOrderList()

    }

    render() {

        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        
                        <Grid container spacing={2}>
                            <Grid item lg={12} xs={12} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="h6" className="font-semibold">{this.props.status}</Typography>

                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item lg={3} xs={12} className='mt-5'>
                                <h4 >Filters</h4>
                            </Grid>
                        </Grid>
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <Divider />
                            </Grid>
                        </Grid>
                        <ValidatorForm
                            className="pt-2"
                            onSubmit={() => this.loadOrderList()}
                            onError={() => null}>
                            {/* Main Grid */}
                            <Grid container="container" spacing={2} direction="row">
                                <Grid item="item" xs={12} sm={12} md={12} lg={12}>
                                    <Grid container="container" spacing={2}>
                                        {/* Ven */}




                                        <Grid className=" w-full" item="item" lg={3} md={3} sm={12} xs={12}>
                                            <SubTitle title="Stock Qty >= More Than" />
                                            <TextValidator
                                                className=" w-full"
                                                placeholder="Stock Qty >= More Than"
                                                name="stockMore"
                                                InputLabelProps={{
                                                    shrink: false
                                                }}
                                                value={this.state.formData.moreStock}
                                                type="number"
                                                variant="outlined"
                                                size="small"
                                                min={0}
                                                onChange={(e) => {
                                                    this.setState({
                                                        formData: {
                                                            ...this.state.moreStock,
                                                            moreStock: e.target.value
                                                        }
                                                    })
                                                }} />
                                        </Grid>

                                        {/* Stock Days 1 */}
                                        <Grid className=" w-full" item="item" lg={3} md={3} sm={12} xs={12}>
                                            <SubTitle title="Stock Qty <= Less Than" />
                                            <TextValidator
                                                className=" w-full"
                                                placeholder="Stock Qty <= Less Than"
                                                name="lessStock"
                                                InputLabelProps={{
                                                    shrink: false
                                                }}
                                                value={this.state.formData.lessStock}
                                                type="number"
                                                variant="outlined"
                                                size="small"
                                                onChange={(e) => {
                                                    this.setState({
                                                        formData: {
                                                            ...this.state.formData,
                                                            lessStock: e.target.value
                                                        }
                                                    })
                                                }} />
                                        </Grid>


                                        <Grid className=" w-full" item="item" lg={3} md={3} sm={12} xs={12} style={{ display: "flex", alignItems: 'flex-end' }}>
                                            <LoonsButton color="primary" size="medium" type="submit" >Filter</LoonsButton>
                                        </Grid>
                                        <Grid className="mt-5 w-full" item="item" lg={3} md={3} sm={12} xs={12} style={{ marginLeft: 'auto' }}>
                                            {/* <div className='flex items-center'> */}
                                                <TextValidator className='w-full' placeholder="Search"
                                                    //variant="outlined"
                                                    fullWidth="fullWidth" variant="outlined" size="small" value={this.state.formData.search} onChange={(e, value) => {
                                                        let formData = this.state.formData
                                                        formData.search = e.target.value;
                                                        this.setState({ formData })
                                                        console.log("form data", this.state.formData)
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
                                                    }} />
                                            {/* </div> */}

                                        </Grid>
                                    </Grid>
                                </Grid>

                                {/* Table Section */}
                                <Grid container="container" className="mt-3 pb-5">
                                    <Grid item="item" lg={12} md={12} sm={12} xs={12}>
                                        {
                                            this.state.loaded
                                                ? <LoonsTable
                                                    //title={"All Aptitute Tests"}
                                                    id={'allAptitute'}
                                                    data={this.state.data}
                                                    columns={this.state.columns}
                                                    options={{
                                                        filterType: 'textField',
                                                        pagination: true,
                                                        size: 'medium',
                                                        serverSide: true,
                                                        print: true,
                                                        viewColumns: true,
                                                        download: true,
                                                        count: this.state.totalItems,
                                                        rowsPerPage: this.state.formData.limit,
                                                        page: this.state.formData.page,
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
                                                                    console.log('action not handled.')
                                                            }
                                                        }
                                                    }}></LoonsTable>
                                                : (
                                                    //loading effect
                                                    <Grid className="justify-center text-center w-full pt-12">
                                                        <CircularProgress size={30} />
                                                    </Grid>
                                                )
                                        }

                                    </Grid>
                                </Grid>
                            </Grid>
                        </ValidatorForm>


                    </LoonsCard>
                </MainContainer>
                <Dialog
                    fullWidth="fullWidth"
                    maxWidth="sm"
                    open={this.state.selectWarehouseView}>

                    <MuiDialogTitle disableTypography="disableTypography">
                        <CardTitle title="Select Your Warehouse" />
                    </MuiDialogTitle>

                    <div className="w-full h-full px-5 py-5">
                        <ValidatorForm
                            onError={() => null} className="w-full">
                            <Autocomplete
                                        disableClearable className="w-full"
                                // ref={elmRef}
                                options={this.state.allWarehouses}
                                onChange={(e, value) => {
                                    if (value != null) {
                                        localStorageService.setItem('Selected_Warehouse', value);
                                        this.setState({
                                            selectWarehouseView: false
                                        })

                                        this.loadWarehouses()
                                        this.setState({
                                            warehouse_loaded: true,
                                            selectedWarehouse: value
                                        })
                                        this.loadOrderList()


                                    }
                                }} value={{
                                    name: this.state.selectedWarehouse
                                        ? (
                                            this.state.allWarehouses.filter((obj) => obj.id == this.state.selectedWarehouse).name
                                        )
                                        : null,
                                    id: this.state.selectedWarehouse
                                }} getOptionLabel={(option) => option.name != null ? option.name + " - " + option.main_or_personal : null} renderInput={(params) => (
                                    <TextValidator {...params} placeholder="Select Your Warehouse"
                                        //variant="outlined"
                                        fullWidth="fullWidth" variant="outlined" size="small" />
                                )} />

                        </ValidatorForm>
                    </div>
                </Dialog>
                <Dialog
                        fullWidth
                        maxWidth="sm"
                        open={this.state.returnDialog}
                        onClose={() => {
                            this.setState({ returnDialog: false,
                                returnQuantity:null,
                                otherRemark:null })
                        }}>
                        <div className="w-full h-full px-5 py-5">

                            <Grid container className=''>
                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <ValidatorForm
                                            className=""
                                            onSubmit={() => this.returnRequest()}
                                            onError={() => null}>
                                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                                <h4 className='mt-5'>Return Item</h4>
                                            </Grid>
                                            {/* <Grid container={2}>
                                            <Grid item lg={6} md={6} sm={6} xs={6}>
                                                <h7 className='mt-2'>Total Received Quantity : {parseInt(this.state.totalReceivedItems)}</h7>
                                            </Grid>
                                            <Grid item lg={6} md={6} sm={6} xs={6}>
                                                <h7 className='mt-2'>Current Stock : {parseInt(this.state.currentStock)}</h7>
                                            </Grid>
                                            </Grid> */}
                                            <Grid item lg={12} md={12} sm={12} xs={12} className="mb-2 mt-5">
                                                <h5 className=''>Return to : </h5>
                                                <Autocomplete
                                        disableClearable
                                                    className="w-full"
                                                    options={this.state.drugStoreData}
                                                    
                                                    getOptionLabel={(option) =>
                                                        option.name ?
                                                            (option.name)
                                                            : ('')
                                                    }
                                                    getOptionSelected={(option, value) =>
                                                        console.log("ok")
                                                    }
                                                    onChange={(event, value) => {
                                                        // console.log("selected_bin", this.state.selected_bin)
                                                        // let filterData = this.state.filterData
                                                        if (value != null) {
                                                            this.setState({
                                                                selected_ds : value.id
                                                            })
                                                            // this.state.selected_ds = value.id
                                                        } else {
                                                            this.setState({
                                                                selected_ds : null
                                                            })
                                                        }
                                                        // this.setState({ filterData })

                                                    }}
                                                    validators={[
                                                        'required',
                                                    ]}
                                                    errorMessages={[
                                                        'This field is required',
                                                    ]}
                                                    // value={this.state.warehouse || this.state.warehouse.WarehousesBins.find((v) =>
                                                    //     v.id == this.state.selected_bin
                                                    // )}
                                                    renderInput={(params) => (
                                                        <TextValidator
                                                            {...params}
                                                            placeholder="Select Drugstore"
                                                            //variant="outlined"
                                                            value={this.state.selected_ds}
                                                            fullWidth
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                            variant="outlined"
                                                            size="small"
                                                            validators={[
                                                                'required',
                                                            ]}
                                                            errorMessages={[
                                                                'This field is required',
                                                            ]}
                                                            
                                                        />
                                                    )}
                                                />

                                            </Grid>
                                            <Grid item lg={12} md={12} sm={12} xs={12}
                                                // style={{ visibility: `${this.state.filterData.visible}` }}
                                                className="mt-5">

                                                <h5 className=''>Return Quantity : </h5>
                                                <TextValidator
                                                    className='mt-2'
                                                    fullWidth
                                                    placeholder="Return Quantity"
                                                    name="return_quantity"
                                                    InputLabelProps={{
                                                        shrink: false,
                                                    }}
                                                    
                                                    value={this.state.returnQuantity}
                                                    // style={{
                                                    //     width: "75%",
                                                    //     visibility: this.state.remarks[tableMeta.rowIndex].value
                                                    // }}
                                                    type="number"
                                                    // multiline
                                                    // rows={3}
                                                    InputProps={{
                                                        inputProps: { min: 0},
                                                       
                                                      }}
                                                    variant="outlined"
                                                    size="small"
                                                    onChange={(e) => {
                                                       
                                                        this.setState({
                                                            returnQuantity: e.target.value,
                                                        })
                                                    }}
                                                    validators={[
                                                        'required',
                                                        'minNumber: 01',
                                                        'maxNumber:'+this.state.itemQuantity 
                                                        // || 'maxNumber:'+ this.state.currentStock ,

                                                    ]}
                                                    errorMessages={[
                                                        'This field is required',
                                                        'Quantity Should Greater-than: 01 ',
                                                        `Quantity Should Less-than: ${parseInt(this.state.itemQuantity)} `,
                                                        // `Quantity Should Less-than: ${parseInt(this.state.currentStock)} `

                                                    ]}
                                                />
                                            </Grid>
                                            <Grid item lg={12} md={12} sm={12} xs={12} className="mb-2 mt-5">
                                                <h5 className=''>Remark : </h5>
                                                <Autocomplete
                                        disableClearable
                                                    className="w-full"
                                                    options={this.state.remarks}
                                                    
                                                    getOptionLabel={(option) =>
                                                        option.type ?
                                                            (option.type)
                                                            : ('')
                                                    }
                                                    getOptionSelected={(option, value) =>
                                                        console.log("ok")
                                                    }
                                                    onChange={(event, value) => {
                                                        // console.log("selected_bin", this.state.selected_bin)
                                                        // let filterData = this.state.filterData
                                                        if (value != null) {
                                                            this.setState({
                                                                remarkID : value.id
                                                            })
                                                            // this.state.selected_ds = value.id
                                                        } else {
                                                            this.setState({
                                                                remarkID : null
                                                            })
                                                        }
                                                        // this.setState({ filterData })

                                                    }}
                                                    validators={[
                                                        'required',
                                                    ]}
                                                    errorMessages={[
                                                        'This field is required',
                                                    ]}
                                                    // value={this.state.warehouse && this.state.warehouse.WarehousesBins.find((v) =>
                                                    //     v.id == this.state.selected_bin
                                                    // )}
                                                    renderInput={(params) => (
                                                        <TextValidator
                                                            {...params}
                                                            placeholder="Select Remark"
                                                            //variant="outlined"
                                                            value={this.state.remarkID}
                                                            fullWidth
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                            variant="outlined"
                                                            size="small"
                                                            validators={[
                                                                'required',
                                                            ]}
                                                            errorMessages={[
                                                                'This field is required',
                                                            ]}
                                                        />
                                                    )}
                                                />

                                            </Grid>

                                            <Grid item lg={12} md={12} sm={12} xs={12}
                                                // style={{ visibility: `${this.state.filterData.visible}` }}
                                                className="mt-5">

                                                <h5 className=''>Other Remark : </h5>
                                                <TextValidator
                                                    className='mt-2'
                                                    fullWidth
                                                    placeholder="Other Remark"
                                                    name="return_quantity"
                                                    InputLabelProps={{
                                                        shrink: false,
                                                    }}
                                                    
                                                    value={this.state.otherRemark}
                                                    // style={{
                                                    //     width: "75%",
                                                    //     visibility: this.state.remarks[tableMeta.rowIndex].value
                                                    // }}
                                                    type="text"
                                                    // multiline
                                                    // rows={3}
                                                    variant="outlined"
                                                    size="small"
                                                    onChange={(e) => {
                                                        this.setState({
                                                            otherRemark: e.target.value,
                                                        })
                                                    }}
                                            validators={['required']}
                                            errorMessages={[
                                                'This field is required',
                                            ]} 
                                                />
                                            </Grid>

                                            <Grid container={2}>
                                            <Grid item lg={2} md={2} sm={2} xs={2}>
                                                <Button
                                                    className="mt-3 mb-5"
                                                    progress={this.state.progress}
                                                    scrollToTop={false}
                                                    // type='submit'
                                                    // startIcon="search"
                                                    onClick={() => { this.setState({
                                                        returnDialog:false
                                                    })
                                                 }}
                                                >
                                                    <span className="capitalize">Cancel</span>
                                                </Button>
                                            </Grid>
                                            <Grid item lg={4} md={4} sm={4} xs={4}>
                                                <Button
                                                    className="mt-3 mb-5"
                                                    progress={this.state.progress}
                                                    scrollToTop={false}
                                                    type='submit'
                                                    // startIcon="search"
                                                    // onClick={() => { 
                                                    //     if(this.state.otherRemark !=null || this.state.remarkID != null || this.state.returnQuantity !=null || this.state.selected_ds != null){
                                                    //         this.returnRequest()
                                                    //     }
                                                    //     else{
                                                    //         this.setState({
                                                    //             alert:true,
                                                    //             message:'Please fill the Fields',
                                                    //             severity:'error'
                                                    //         })
                                                    //     }
                                                    // }}
                                                >
                                                    <span className="capitalize">Submit</span>
                                                </Button>
                                            </Grid>   
                                            </Grid>
                                        </ValidatorForm>
                                </Grid>
                            </Grid>

                        </div>
                    </Dialog>

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
            </Fragment>
        )
    }
}

export default Expired;