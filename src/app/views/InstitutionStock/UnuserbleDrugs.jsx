import { Button, CircularProgress, Dialog, Divider, Grid, InputAdornment, Typography,FormControlLabel,Radio,Tabs,
    
    Tab, } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { CardTitle, LoonsCard, LoonsSnackbar, LoonsTable, MainContainer, SubTitle } from "app/components/LoonsLabComponents";
import LoonsButton from "app/components/LoonsLabComponents/Button";
import React, { Fragment } from "react";
import { Component } from "react";
import SearchIcon from '@material-ui/icons/Search';
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import GroupSetupService from 'app/services/datasetupServices/GroupSetupService';
import CategoryService from 'app/services/datasetupServices/CategoryService';
import ClassDataSetupService from 'app/services/datasetupServices/ClassDataSetupService';
import WarehouseServices from 'app/services/WarehouseServices';
import PharmacyOrderService from 'app/services/PharmacyOrderService';
import ApartmentIcon from '@material-ui/icons/Apartment';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import localStorageService from 'app/services/localStorageService';
import { dateParse } from "utils";
import AppBar from '@material-ui/core/AppBar'
import Expired from './UnsuableTabs/Expired'
class UnuserbleDrugs extends Component { 

    constructor(props) {
        super(props)
        this.state = {
            updateData: {
                noOfDays: 0
            },
            alert: false,
            message: '',
            severity: 'success',
            status:'hello',
            activeTab:0,
            formData: {
                item_id: null,
                description: null,
                store_quantity: null,
                lessStock: null,
                moreStock: null,
                page: 0,
                limit: 25,
                //warehouse_id: this.props.warehouse_id,
                owner_id: this.props.ownerID,
                exp_date_order: true,
                exp_date_grater_than_zero_search:'false',
                quantity_grater_than_zero_search:'false',
                search: null,
                item_status:['Inactive'],
                orderby_sr:true,
            },


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
                    name: 'ItemSnap', // field name in the row object
                    label: 'SR Number', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        sort: true, // enable sorting
                        customSort: (a, b) => {
                            return a.sr_no - b.sr_no; // sort by ascending sr_no values
                        },
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



            ],
            data: []

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
        let params = { employee_id: id, owner_id: this.props.ownerID }
        let res = await WarehouseServices.getWareHouseUsers(params);
        if (res.status == 200) {
            console.log("CPALLOders", res.data.view.data)

            res.data.view.data.forEach(element => {
                all_pharmacy_dummy.push(
                    {
                        warehouse: element.Warehouse,
                        name: element.Warehouse.name,
                        main_or_personal: element.Warehouse.main_or_personal,
                        owner_id: this.props.ownerID,
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

    async componentDidMount() {
        // this.loadWarehouses();
        // this.load_days(31)
        //this.loadData()
        /* let login_user_info = await localStorageService.getItem('userInfo')

        if (
            login_user_info.roles.includes('MSD SCO') || login_user_info.roles.includes('MSD SCO Distribution') ||
            login_user_info.roles.includes('MSD SCO QA') || login_user_info.roles.includes('MSD SCO Supply') ||
            login_user_info.roles.includes('Distribution Officer') || login_user_info.roles.includes('MSD Distribution Officer')) {
            this.setState({
                formData: {
                    ...this.state.formData,
                    owner_id: '000',
                    distribution_officer_id: login_user_info.id
                }

            }, () => {
                this.loadData()
                this.loadOrderList()
            })
        } else {
            this.setState({
                formData: {
                    ...this.state.formData,
                    owner_id: this.props?.owner_id,
                    //distribution_officer_id: login_user_info.id
                }

            }, () => {
               
        this.loadOrderList()
            })
        } */


        let login_user_info = await localStorageService.getItem('userInfo')
        let selected_Warehouse = await localStorageService.getItem('Selected_Warehouse')?.warehouse?.id


        let warehouse_id = null;

        // if (login_user_info.roles.includes('Drug Store Keeper') ||
        //     login_user_info.roles.includes('RMSD Distribution Officer') ||
        //     login_user_info.roles.includes('Drugstore Pharmacist(S)') ||
        //     login_user_info.roles.includes('Blood Bank Consultant') ||
        //     login_user_info.roles.includes('Blood Bank MLT (NOIC)') ||
        //     login_user_info.roles.includes('Blood Bank MLT') ||

        //     login_user_info.roles.includes('Chief MLT') ||
        //     login_user_info.roles.includes('RMSD ADMIN') ||
        //     login_user_info.roles.includes('RMSD MSA') ||
        //     login_user_info.roles.includes('RMSD Pharmacist') ||
        //     login_user_info.roles.includes('RMSD OIC') ||
        //     login_user_info.roles.includes('MSD MSA')||
        //     login_user_info.roles.includes('Pharmacist')||
        //     login_user_info.roles.includes('Counter Pharmacist')||
        //     login_user_info.roles.includes('Admin Pharmacist')||
        //     login_user_info.roles.includes('Medical Laboratory Technologist')||
        //     login_user_info.roles.includes('Radiographer')
        //     ) {

        //         warehouse_id = this.props.warehouse_id?this.props.warehouse_id:selected_Warehouse


        // } else {
        //     warehouse_id = null;
        // }


        if (
            login_user_info.roles.includes('MSD Distribution Officer') ||
            login_user_info.roles.includes('MSD SCO') ||
            login_user_info.roles.includes('MSD SCO Supply')
        ) {
            this.setState({
                formData: {
                    ...this.state.formData,
                    owner_id: this.props?.ownerID,
                    // warehouse_id: warehouse_id,
                    distribution_officer_id: login_user_info.id,
                    user_role: login_user_info.roles[0]
                }

            }, () => {
                this.loadData()
                this.loadOrderList()
            })
        } else {

            this.setState({
                formData: {
                    ...this.state.formData,
                    owner_id: this.props?.ownerID,//'000',
                    distribution_officer_id: null,
                    // warehouse_id: warehouse_id,
                    user_role: login_user_info.roles[0]
                }

            }, () => {
                this.loadData()
                this.loadOrderList()
            })
        }

    }

    render() {

        return (
            <Fragment>
                <AppBar position="static" color="default" className="mb-4 mt-2">
                            <Grid item lg={12} md={12} xs={12}>
                                <Tabs style={{ minHeight: 39, height: 26 }}
                                    indicatorColor="primary"
                                    variant='fullWidth'
                                    textColor="primary"
                                    value={this.state.activeTab}
                                    onChange={(event, newValue) => {
                                        console.log(newValue)
                                        this.setState({ activeTab: newValue })
                                    }} >

                                    <Tab label={<span className="font-bold text-12">Expired</span>} />
                                    <Tab label={<span className="font-bold text-12">Batch Withhold</span>} />
                                    <Tab label={<span className="font-bold text-12">Batch Withdraw</span>} />
                                    <Tab label={<span className="font-bold text-12">Item Withhold</span>} />
                                    <Tab label={<span className="font-bold text-12">Item Withdraw</span>} />
                                    <Tab label={<span className="font-bold text-12">Under Surveillance</span>} />
                                    
                                   
                                </Tabs>
                            </Grid>
                        </AppBar>
                    
                        
                                <div> 
                                    {this.state.activeTab == 0 ?
                                        <div className='w-full'>
                                    <Expired ownerID={this.props.ownerID} status={"Expired Drugs"}></Expired>
                                        </div>
                                        : null
                                    }
                                    {this.state.activeTab == 1 ?
                                        <div className='w-full'>
                                            <Expired ownerID={this.props.ownerID} status={"Batch Withhold"}></Expired>
                                        </div> : null
                                    }
                                    {this.state.activeTab == 2 ?
                                        <div className='w-full'>
                                            <Expired ownerID={this.props.ownerID} status={"Batch Withdraw"}></Expired>
                                        </div> : null
                                    }
                                    {this.state.activeTab == 3 ?
                                        <div className='w-full'>
                                            <Expired ownerID={this.props.ownerID} status={"Item Withhold"}></Expired>
                                        </div> : null
                                    }
                                    
                                     {this.state.activeTab == 4 ?
                                        <div className='w-full'>
                                            <Expired ownerID={this.props.ownerID} status={"Item Withdraw"}></Expired>
                                        </div> : null
                                    }
                                     {this.state.activeTab == 5 ?
                                        <div className='w-full'>
                                            <Expired ownerID={this.props.ownerID} status={"Under Serveilance"}></Expired>
                                        </div> : null
                                    }
                                     
                                </div>
                              
                        {/* <Grid container spacing={2}>
                            <Grid item lg={12} xs={12} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="h6" className="font-semibold">Unusable Drugs</Typography>

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
                        </Grid> */}
                        {/* <ValidatorForm
                            className="pt-2"
                            onSubmit={() => this.loadOrderList()}
                            onError={() => null}>
                            {/* Main Grid 
                            <Grid container="container" spacing={2} direction="row">
                                <Grid item="item" xs={12} sm={12} md={12} lg={12}>
                                    <Grid container="container" spacing={2}>
                                       




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


                                        <Grid className=" w-full" item="item" lg={4} md={4} sm={12} xs={12} style={{ display: "flex", alignItems: 'flex-end' }}>
                                            <LoonsButton color="primary" size="medium" type="submit" >Filter</LoonsButton>
                                        </Grid>
                                        <Grid item="item" lg={12} md={12} xs={4}>
                                            <div className='flex items-center'>
                                                <TextValidator className='w-full' placeholder="Search"
                                                    //variant="outlined"
                                                    fullWidth="fullWidth" variant="outlined" size="small" value={this.state.formData.search} onChange={(e, value) => {
                                                        let formData = this.state.formData
                                                        formData.search = e.target.value;
                                                        this.setState({ formData })
                                                        console.log("form data", this.state.formData)
                                                    }}
                                                    
                                                    InputProps={{
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <SearchIcon></SearchIcon>
                                                            </InputAdornment>
                                                        )
                                                    }} />
                                            </div>

                                        </Grid>
                                    </Grid>
                                </Grid>

                               
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
                                                        print: false,
                                                        viewColumns: true,
                                                        download: false,
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
                        </ValidatorForm> */}


                   
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

export default UnuserbleDrugs;