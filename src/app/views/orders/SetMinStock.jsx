import { Button, CircularProgress, Dialog, Divider, Grid, InputAdornment, Typography } from "@material-ui/core";
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
import WarehouseServices from '../../services/WarehouseServices';
import PharmacyOrderService from 'app/services/PharmacyOrderService';
import ApartmentIcon from '@material-ui/icons/Apartment';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import localStorageService from 'app/services/localStorageService';

class SetMinStock extends Component {

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
                ven_id: null,
                class_id: null,
                category_id: null,
                group_id: null,
                item_id: null,
                description: null,
                store_quantity: null,
                lessStock: null,
                moreStock: null,
                page: 0,
                limit: 10,
                warehouse_id: null,
                search: null,
                orderby_sr: true
            },
            filterData: {
                limit: 10,
                page: 0,
                warehouse_id: null,
                orderby_sr: true
            },
            minStockData: {
                minimum_stock_level: null,
                reorder_level: 1000,
                stock_level_status: "Manual"
            },
            all_ven: [],
            all_item_class: [],
            all_item_category: [],
            all_item_group: [],
            loaded: false,
            totalItems: 0,
            selectWarehouseView: false,
            warehouse_loaded: false,
            selectedWarehouse:null,
            selectedWarehouseViewName:null,
            allWarehouses:[],
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
                            if (tableMeta.rowData[tableMeta.columnIndex] == null) {
                                return 'N/A'
                            } else {
                                return (tableMeta.rowData[tableMeta.columnIndex].sr_no)
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
                            if (tableMeta.rowData[tableMeta.columnIndex] == null) {
                                return 'N/A'
                            } else {
                                return (tableMeta.rowData[tableMeta.columnIndex].medium_description)
                            }
                        }
                    }
                },
                {
                    name: 'ItemSnap', // field name in the row object
                    label: 'Dosage', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log("tableMeta", tableMeta);
                            if (tableMeta.rowData[tableMeta.columnIndex] == null) {
                                return 'N/A'
                            } else {
                                return (tableMeta.rowData[tableMeta.columnIndex].strength)
                            }
                        }
                    }
                },
                {
                    name: 'reorder_level', // field name in the row object
                    label: 'Re-Order Level', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        // width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            console.log('rererere', this.state.data[tableMeta.rowIndex])
                            return (
                                <ValidatorForm
                                    className="pt-2"
                                    onSubmit={() => this.onSubmitData(tableMeta)}
                                    onError={() => null}
                                >
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} lg={6}>
                                            <TextValidator
                                                value={this.state.data[tableMeta.rowIndex].reorder_level}
                                                variant="outlined"
                                                size="small"
                                                onChange={event => {
                                                    let formdata = this.state.data
                                                    formdata[tableMeta.rowIndex].reorder_level = event.target.value
                                                    //    console.log('e.target.value', event.target
                                                    //    .value);
                                                    this.setState({
                                                        // minStockData: {
                                                        //     ...this.state.minStockData,
                                                        //     reorder_level: event.target
                                                        //         .value
                                                        // }
                                                        data:formdata
                                                    })
                                                }}></TextValidator>
                                        </Grid>
                                    </Grid>
                                </ValidatorForm>
                            )


                        },
                    }
                },
                {
                    name: 'cnsmptn', // field name in the row object
                    label: 'Consumption(Days)', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10
                    }
                },
                {
                    name: 'minimum_stock_level', // field name in the row object
                    label: 'Minimun Stock Level (Current Cosumption)', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: false,
                        width: 10
                    }
                },
                {
                    name: 'id', // field name in the row object
                    label: 'Min Stock Level Input', // column title that will be shown in table
                    options: {
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <ValidatorForm
                                    className="pt-2"
                                    onSubmit={() => this.onSubmitData(tableMeta.rowIndex)}
                                    onError={() => null}
                                >
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} lg={6}>
                                            <TextValidator

                                                variant="outlined"
                                                size="small"
                                                value={this.state.data[tableMeta.rowIndex].minimum_stock_level}
                                                onChange={event => {let formdata = this.state.data
                                                    formdata[tableMeta.rowIndex].minimum_stock_level = event.target.value
                                                    //    console.log('e.target.value', event.target
                                                    //    .value);
                                                    this.setState({
                                                        // minStockData: {
                                                        //     ...this.state.minStockData,
                                                        //     minimum_stock_level: event.target
                                                        //         .value
                                                        // }
                                                        data:formdata
                                                    })
                                                }}></TextValidator>
                                        </Grid>
                                        <Grid item xs={12} lg={6}>
                                            <LoonsButton
                                                className="mt-2"
                                                progress={false}
                                                type="submit"
                                                scrollToTop={true}
                                            // onClick={this.onSubmit}
                                            >
                                                <span className="capitalize">Save</span>
                                            </LoonsButton>
                                        </Grid>
                                    </Grid>
                                </ValidatorForm>
                            )


                        },
                        width: 10
                    }
                },
                {
                    name: 'status', // field name in the row object
                    label: 'Status', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10
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
        let res = await PharmacyOrderService.getDefaultItems(this.state.formData)
        let order_id = 0
        if (res.status) {
            if (res.data.view.data.length != 0) {
                order_id = res
                    .data
                    .view
                    .data[0]
                    .pharmacy_order_id
            }
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

    async onSubmitData(tableMeta) {
        // console.log('save clicked', this.state.minStockData)
        // console.log('save clicked-tablemeta', tableMeta)
        let data  = this.state.data[tableMeta]

        

        if (data.minimum_stock_level == null) {
            this.setState({
                alert: true,
                message: 'Please enter a value to proceed',
                severity: 'error',
            })
            return;
        }
        let bodydata = {
            reorder_level: data.reorder_level,
            minimum_stock_level:data.minimum_stock_level
        }
        let params = {
            warehouse_id: this.state.filterData.warehouse_id
        }

        let res = await PharmacyOrderService.setItemMinStockLevel(data.id, params, bodydata)

        if (res.status && res.status == 200) {
            this.setState({
                alert: true,
                message: 'Minimum Stock Value Set Successfully',
                severity: 'success',
            },()=>{
                this.loadOrderList()
            })
          //  window.location.reload();
        } else {
            this.setState({
                alert: true,
                message: 'Setting Minimum Stock Value Unsuccessful',
                severity: 'error',
            })
        }
    }

    async loadWarehouses() {
        this.setState({
            warehouse_loaded:false
        })
        var user = await localStorageService.getItem('userInfo');
        console.log('user', user)
        var id = user.id;
        var all_pharmacy_dummy = [];
        var selected_warehouse_cache = await localStorageService.getItem('Selected_Warehouse');
        if (!selected_warehouse_cache) {
            this.setState({
                selectWarehouseView:true
            })
        }
        else {
            this.state.formData.warehouse_id = selected_warehouse_cache.id
            this.setState({
                selectWarehouseView:false,
                selectedWarehouseViewName:selected_warehouse_cache.name,
                warehouse_loaded:true
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
                allWarehouses:all_pharmacy_dummy
            })
        }
    }

    componentDidMount() {
        this.loadWarehouses();
        // this.load_days(31)
        this.loadData()
        this.loadOrderList()

    }

    render() {

        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        <Grid container spacing={2}>
                            <Grid item lg={12} xs={12} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="h6" className="font-semibold">Stock level Setup</Typography>
                                <Grid
                                    className="flex"
                                >
                                    <Grid
                                        className="pt-2 pr-3"
                                    >
                                        <Typography>{this.state.selectedWarehouseViewName !== null ? "You're in "+this.state.selectedWarehouseViewName :null}</Typography>
                                    </Grid>
                                    <LoonsButton
                                        color='primary'
                                        onClick={() => {
                                        this.setState({
                                            selectWarehouseView:true,
                                            loaded:false
                                        })
                                        // setSelectWarehouseView(true)
                                        // setLoaded(false)
                                    }}
                                    >
                                        <ApartmentIcon />
                                        {/* {loaded ? selectedWarehouse.name : 'Chanage Warehouse'} */}Change Warehouse
                                    </LoonsButton>
                                </Grid>
                            </Grid>
                        </Grid>
                        {this.state.warehouse_loaded && <>
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
                                            <Grid item="item" xs={12} sm={12} md={3} lg={3}>
                                                <SubTitle title="Ven" />
                                                <Autocomplete
                                        disableClearable className="w-full"
                                                    options={this.state.all_ven.sort((a, b) => a.name?.localeCompare(b.name))}
                                                    onChange={(e, value) => {
                                                        if (value != null) {
                                                            let formData = this.state.formData
                                                            formData.ven_id = value.id
                                                            this.setState({ formData })
                                                        }
                                                    }}
                                                    /*  defaultValue={this.state.all_district.find(
                                                    (v) => v.id == this.state.formData.district_id
                                                    )} */
                                                    value={this
                                                        .state
                                                        .all_ven
                                                        .find((v) => v.id == this.state.formData.ven_id)}
                                                    getOptionLabel={(
                                                        option) => option.name
                                                            ? option.name
                                                            : ''}
                                                    renderInput={(params) => (
                                                        <TextValidator {...params} placeholder="Ven"
                                                            //variant="outlined"
                                                            fullWidth="fullWidth" variant="outlined" size="small" />
                                                    )} />
                                            </Grid>

                                            {/* Serial/Family Number */}
                                            <Grid className=" w-full" item="item" lg={3} md={3} sm={12} xs={12}>
                                                <SubTitle title="Item Class" />
                                                <Autocomplete
                                        disableClearable className="w-full"
                                                    options={this.state.all_item_class.sort((a, b) => a.description?.localeCompare(b.description))}
                                                    onChange={(e, value) => {
                                                        if (value != null) {
                                                            let formData = this.state.formData
                                                            formData.class_id = value.id
                                                            this.setState({ formData })
                                                        }
                                                    }}
                                                    /*  defaultValue={this.state.all_district.find(
                                                    (v) => v.id == this.state.formData.district_id
                                                    )} */
                                                    value={this
                                                        .state
                                                        .all_item_class
                                                        .find((v) => v.id == this.state.formData.class_id)}
                                                    getOptionLabel={(
                                                        option) => option.description
                                                            ? option.description
                                                            : ''}
                                                    renderInput={(params) => (
                                                        <TextValidator {...params} placeholder="Item Class"
                                                            //variant="outlined"
                                                            fullWidth="fullWidth" variant="outlined" size="small" />
                                                    )} />
                                            </Grid>

                                            <Grid className=" w-full" item="item" lg={3} md={3} sm={12} xs={12}>
                                                <SubTitle title="Stock Days >= More Than" />
                                                <TextValidator
                                                    className=" w-full"
                                                    placeholder="Stock Days >= More Than"
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
                                                <SubTitle title="Stock Days <= Less Than" />
                                                <TextValidator
                                                    className=" w-full"
                                                    placeholder="Stock Days <= Less Than"
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

                                            {/* Serial Family Name*/}
                                            <Grid className=" w-full" item="item" lg={3} md={3} sm={12} xs={12}>
                                                <SubTitle title="Item Category" />

                                                <Autocomplete
                                        disableClearable className="w-full"
                                                    options={this.state.all_item_category.sort((a,b)=>(a.description?.localeCompare(b.description)))}
                                                    onChange={(e, value) => {
                                                        if (value != null) {
                                                            let formData = this.state.formData
                                                            formData.category_id = value
                                                                .id
                                                            this
                                                                .setState({ formData })
                                                        }
                                                    }
                                                }
                                                    value={this
                                                        .state
                                                        .all_item_category
                                                        .find((v) => v.id == this.state.formData.category_id)}
                                                    getOptionLabel={(
                                                        option) => option.description
                                                            ? option.description
                                                            : ''}
                                                    renderInput={(params) => (
                                                        <TextValidator {...params} placeholder="Item Category"
                                                            //variant="outlined"
                                                            fullWidth="fullWidth" variant="outlined" size="small" />
                                                    )} />
                                              
                                        </Grid>

                                            {/* Item Group*/}
                                            <Grid className=" w-full" item="item" lg={3} md={3} sm={12} xs={12}>
                                                <SubTitle title="Item Group" />

                                                <Autocomplete
                                        disableClearable
                                                    className="w-full"
                                                    options={this.state.all_item_group.sort((a,b)=> (a.description?.localeCompare(b.description)))}
                                                    onChange={(e, value) => {
                                                        if (value != null) {
                                                            let formData = this.state.formData
                                                            formData.group_id = value
                                                                .id
                                                            this
                                                                .setState({ formData })
                                                        }
                                                    }}
                                                    value={this
                                                        .state
                                                        .all_item_group
                                                        .find((v) => v.id == this.state.formData.group_id)}
                                                    getOptionLabel={(
                                                        option) => option.description
                                                            ? option.description
                                                            : ''}
                                                    renderInput={(params) => (
                                                        <TextValidator {...params} placeholder="Item Group"
                                                            //variant="outlined"
                                                            fullWidth="fullWidth" variant="outlined" size="small" />
                                                    )} />
                                            </Grid>

                                            {/* Drug Store Qty*/}
                                            <Grid className=" w-full" item="item" lg={3} md={3} sm={12} xs={12}>
                                                <SubTitle title="Drug Store Qty" />

                                                <TextValidator
                                                    className=" w-full"
                                                    placeholder="Drug Store Qty"
                                                    name="drug_store_qty"
                                                    InputLabelProps={{
                                                        shrink: false
                                                    }}
                                                    value={this.state.formData.description}
                                                    type="text"
                                                    variant="outlined"
                                                    size="small"
                                                    onChange={(e) => {
                                                        this.setState({
                                                            formData: {
                                                                ...this.state.formData,
                                                                description: e.target.value
                                                            }
                                                        })
                                                    }}
                                                    // validators={['required']}
                                                    errorMessages={['this field is required']} />
                                            </Grid>
                                            <Grid className=" w-full" item="item" lg={3} md={3} sm={12} xs={12} style={{ display: "flex", alignItems: 'flex-end' }}>
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
                                                </div>

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
                            </ValidatorForm>
                        </>}

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
                                options={this.state.allWarehouses.sort((a,b)=> (a.name.localeCompare(b.name)))} 
                                onChange={(e, value) => {
                                    if (value != null) {
                                        localStorageService.setItem('Selected_Warehouse', value);
                                        this.setState({
                                            selectWarehouseView:false
                                        })
    
                                        this.loadWarehouses()
                                        this.setState({
                                            warehouse_loaded:true,
                                            selectedWarehouse:value,
                                            selectedWarehouseName:value.name
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

export default SetMinStock;