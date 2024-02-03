import { Button, CircularProgress, Dialog, Divider, Grid, InputAdornment, Typography,IconButton,Tooltip } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { CardTitle, LoonsCard, LoonsSnackbar, LoonsTable, MainContainer, SubTitle, } from "app/components/LoonsLabComponents";
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
import EstimationService from 'app/services/EstimationService'
import { filter } from "lodash";
import VisibilityIcon from "@material-ui/icons/Visibility";

class RMSDSetItemEstimations extends Component {

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
                search: null
            },
            loaded:true,
            filterData: {
                create_type:null,
                estimation_id:this.props.id,
                limit: 20,
                page: 0,
                warehouse_id: null,
                owner_id:null,
                search_type:null
            },
            months:[{
                january:0,
                february:0,
                march:0,
                april:0,
                may:0,
                june:0,
                july:0,
                august:0,
                september:0,
                october:0,
                november:0,
                december:0,
            },],
            newFormData:{
                previous_estimate:null
            },
            minStockData: {
                minimum_stock_level: null,
                reorder_level: 1000,
                lead_time: 1,
                stock_level_status: "Manual"
            },
            all_ven: [],
            all_item_class: [],
            all_item_category: [],
            all_item_group: [],
            // loaded: false,
            totalItems: 0,
            selectWarehouseView: false,
            warehouse_loaded: false,
            selectedWarehouse:null,
            allWarehouses:[],
            columns: [
              
                {
                    name: 'ItemSnap', // field name in the row object
                    label: 'SR Number', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
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
                // {
                //     name: 'ItemSnap', // field name in the row object
                //     label: 'Dosage', // column title that will be shown in table
                //     options: {
                //         filter: true,
                //         display: true,
                //         width: 10,
                //         customBodyRender: (value, tableMeta, updateValue) => {
                //             // console.log("tableMeta", tableMeta);
                //             if (tableMeta.rowData[tableMeta.columnIndex] == null) {
                //                 return 'N/A'
                //             } else {
                //                 return (tableMeta.rowData[tableMeta.columnIndex].strength)
                //             }
                //         }
                //     }
                // },
                // {
                //     name: 'reorder_level', // field name in the row object
                //     label: 'Re-Order Level', // column title that will be shown in table
                //     options: {
                //         filter: true,
                //         display: true,
                //         width: 10
                //     }
                // },
                // {
                //     name: 'lead_time', // field name in the row object
                //     label: 'Lead Time', // column title that will be shown in table
                //     options: {
                //         filter: true,
                //         display: true,
                //         width: 10
                //     }
                // },
                // {
                //     name: 'cnsmptn', // field name in the row object
                //     label: 'Consumption', // column title that will be shown in table
                //     options: {
                //         filter: true,
                //         display: true,
                //         width: 10
                //     }
                // },
                // {
                //     name: 'minimum_stock_level', // field name in the row object
                //     label: 'Minimun Stock Level (Current Cosumption)', // column title that will be shown in table
                //     options: {
                //         filter: true,
                //         display: true,
                //         width: 10
                //     }
                // },
                // {
                //     name: 'jan', // field name in the row object
                //     label: 'January', // column title that will be shown in table
                //     options: {
                //         // filter: true,
                //         customBodyRender: (value, tableMeta, updateValue) => {
                //             return (
                              
                //                     <Grid container spacing={2}>
                //                         <Grid item xs={12} lg={6}>
                //                             <TextValidator

                //                                 variant="outlined"
                //                                 size="small"
                //                                 onChange={event => {
                //                                     //    console.log('e.target.value', event.target
                //                                     //    .value);
                //                                     this.setState({
                //                                         minStockData: {
                //                                             ...this.state.minStockData,
                //                                             minimum_stock_level: event.target
                //                                                 .value
                //                                         }
                //                                     })
                //                                 }}></TextValidator>
                //                         </Grid>
                //                     </Grid>
                              
                //             )


                //         },
                //         width: 10
                //     }
                // },
                {
                    name: 'jan', // field name in the row object
                    label: 'Jan', // column title that will be shown in table
                    options: {
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log("tableMeta", tableMeta);
                                let data = this.state.data[tableMeta.rowIndex]?.jan
                                return <p>{data}</p>
                           
                        }                      
                    }
                },

                {
                    name: 'feb', // field name in the row object
                    label: 'Feb', // column title that will be shown in table
                    options: {
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log("tableMeta", tableMeta);
                                let data = this.state.data[tableMeta.rowIndex]?.feb
                                return <p>{data}</p>
                           
                        }      
                    }
                },

                {
                    name: 'mar', // field name in the row object
                    label: 'Mar', // column title that will be shown in table
                    options: {
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log("tableMeta", tableMeta);
                                let data = this.state.data[tableMeta.rowIndex]?.mar
                                return <p>{data}</p>
                           
                        }    
                       
                    }
                },

                {
                    name: 'april', // field name in the row object
                    label: 'Apr', // column title that will be shown in table
                    options: {
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log("tableMeta", tableMeta);
                                let data = this.state.data[tableMeta.rowIndex]?.apr
                                return <p>{data}</p>
                           
                        }  
                    }
                },

                {
                    name: 'may', // field name in the row object
                    label: 'May', // column title that will be shown in table
                    options: {
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log("tableMeta", tableMeta);
                                let data = this.state.data[tableMeta.rowIndex]?.may
                                return <p>{data}</p>
                           
                        }                      }
                },
               
                {
                    name: 'june', // field name in the row object
                    label: 'Jun', // column title that will be shown in table
                    options: {
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log("tableMeta", tableMeta);
                                let data = this.state.data[tableMeta.rowIndex]?.june
                                return <p>{data}</p>
                           
                        }                         }
                },

                {
                    name: 'july', // field name in the row object
                    label: 'Jul', // column title that will be shown in table
                    options: {
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log("tableMeta", tableMeta);
                                let data = this.state.data[tableMeta.rowIndex]?.july
                                return <p>{data}</p>
                           
                        }                       }
                },
                {
                    name: 'august', // field name in the row object
                    label: 'Aug', // column title that will be shown in table
                    options: {
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log("tableMeta", tableMeta);
                                let data = this.state.data[tableMeta.rowIndex]?.aug
                                return <p>{data}</p>
                           
                        }                          }
                },
                {
                    name: 'september', // field name in the row object
                    label: 'Sep', // column title that will be shown in table
                    options: {
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log("tableMeta", tableMeta);
                                let data = this.state.data[tableMeta.rowIndex]?.sep
                                return <p>{data}</p>
                           
                        }                           }
                },

                {
                    name: 'october', // field name in the row object
                    label: 'Oct', // column title that will be shown in table
                    options: {
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log("tableMeta", tableMeta);
                                let data = this.state.data[tableMeta.rowIndex]?.oct
                                return <p>{data}</p>
                           
                        }                      }
                },
                {
                    name: 'november', // field name in the row object
                    label: 'Nov', // column title that will be shown in table
                    options: {
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log("tableMeta", tableMeta);
                                let data = this.state.data[tableMeta.rowIndex]?.nov
                                return <p>{data}</p>
                           
                        }                      }
                },
                {
                    name: 'december', // field name in the row object
                    label: 'Dec', // column title that will be shown in table
                    options: {
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log("tableMeta", tableMeta);
                                let data = this.state.data[tableMeta.rowIndex]?.dec
                                return <p>{data}</p>
                           
                        }                       }
                },
                // {
                //     name: 'id', // field name in the row object
                //     label: 'Estimate', // column title that will be shown in table
                //     options: {
                //         // filter: true,
                //         customBodyRender: (value, tableMeta, updateValue) => {
                //             // console.log("tableMeta", tableMeta);
                //                 let data = this.state.data[tableMeta.rowIndex]?.estimation
                //                 return <p>{data}</p>
                           
                //         }                     }
                // },
                //  {
                //     name: 'consumption', // field name in the row object
                //     label: 'Consumption %', // column title that will be shown in table
                //     options: {
                //         filter: true,
                //         display: true,
                       
                //     }
                // },
                // {
                //     name: 'system', // field name in the row object
                //     label: 'System suggested consumption ', // column title that will be shown in table
                //     options: {
                //         filter: true,
                //         display: true,
                       
                //     }
                // },
                // {
                //     name: 'system', // field name in the row object
                //     label: 'System suggested estimation ', // column title that will be shown in table
                //     options: {
                //         filter: true,
                //         display: true,
                       
                //     }
                // },
                {
                    name: 'id', // field name in the row object
                    label: 'Total Estimation', // column title that will be shown in table
                    options: {
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            let data = this.state.data[tableMeta.rowIndex]?.real_estimation
                            let id = this.props.id 
                            let item_id =this.state.data[tableMeta.rowIndex].ItemSnap?.id
                            return (
                                // <div style={{ width: 70 }}>
                                <Grid container={2}>
                                    <Grid item  xs={12} lg={8} className='mt-2'>
                                   
                                             {data}

                                    </Grid>
                                    <Grid item  xs={12} lg={4}>
                                    <Tooltip title="View">
                                            <IconButton
                                                onClick={() => {
                                                    window.location.href = `/estimation/rmsd-item-/${id}/${item_id}`
                                                }}>
                                                <VisibilityIcon color='primary' />
                                            </IconButton>
                                        </Tooltip>
                                  
                                    </Grid>

                                </Grid>
                                   
                                            /* <LoonsButton
                                                className="mt-2"
                                                progress={false}
                                                // type="submit"
                                                scrollToTop={true}
                                                onClick={()=> {
                                                    this.onSubmitData(this.state.data[tableMeta.rowIndex])
                                                }}
                                            >
                                                <span className="capitalize">Save</span>
                                            </LoonsButton>
                                         */
                                                    
                            )
                        },
                        width: 20
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
     async loadItemEstimation() {
        this.setState({ loaded: false })
        
        let filterData =this.state.filterData
        filterData.estimation_id = this.props.id
        filterData.search_type = 'RMSD'
        console.log('FilterData',filterData)
        let res = await EstimationService.getAllEstimationITEMS(filterData)
        if (res.status == 200) {
            if(res.data.view.data.length !== 0){
                console.log('res',res.data.view.data)
                this.setState(
                    {
                        loaded: true,
                        data: res.data.view.data,
                        totalPages: res.data.view.totalPages,
                        totalItems: res.data.view.totalItems,
                    }
                )

            }
            // else{
            //     this.setState({ loaded: false })
            //     let filterData =this.state.filterData
            //     filterData.estimation_id = this.props.match.params.id 
            //     filterData.create_type= "withitems"      
            //     let res = await EstimationService.createHospitalItem(filterData)
            //     if (res.status == 200) {
            //         this.setState(
            //             {
            //                 loaded: true,
            //                 data: res.data.view.data,
            //                 totalPages: res.data.view.totalPages,
            //                 totalItems: res.data.view.totalItems,
            //             },
            //             () => {
            //                 console.log('Table Data',this.state.data)
                        
            //                 window.location.reload()
            //             }
            //         )
            // }

            // }
        }
       
    }

    // async loadOrderList() {
    //     this.setState({ loaded: false, })
    //     let res = await EstimationService.getAllEstimationITEMS(this.state.filterData)
    //     let order_id = 0
    //     if (res.status) {
    //         if (res.data.view.data.length != 0) {
    //             order_id = res
    //                 .data
    //                 .view
    //                 .data[0]
    //                 .pharmacy_order_id
    //         }
    //         console.log("data", res.data.view.data);
    //         this.setState({
    //             data: res.data.view.data,
    //             loaded: true,
    //             totalItems: res.data.view.totalItems
    //         })
           
    //     }
    // }

    async setPage(page) {
        //Change paginations
        let filterData = this.state.filterData
        filterData.page = page
        this.setState({
            filterData
        }, () => {
            console.log("New formdata", this.state.filterData)
            this.loadItemEstimation()
        })
    }

    async onSubmitData(data) {
        console.log("new Formdata",data)
        let id = data?.id
        console.log("new Formdata2",id)
        let res = await EstimationService.addEstimationToItems(id,data);
        console.log("res",res)
        if (res.status === 200) {
            this.setState({
                alert: true,
                message: 'Item Estimation Added successfully!',
                severity: 'success',
            })
        } else {
            this.setState({
                alert: true,
                message: 'Item Estimation Adding was unsuccessful!',
                severity: 'error',
            })
        }
    }

    // async loadWarehouses() {
    //     this.setState({
    //         warehouse_loaded:false
    //     })
    //     var user = await localStorageService.getItem('userInfo');
    //     console.log('user', user)
    //     var id = user.id;
    //     var all_pharmacy_dummy = [];
    //     var selected_warehouse_cache = await localStorageService.getItem('Selected_Warehouse');
    //     if (!selected_warehouse_cache) {
    //         this.setState({
    //             selectWarehouseView:true
    //         })
    //     }
    //     else {
    //         this.state.formData.warehouse_id = selected_warehouse_cache.id
    //         this.setState({
    //             selectWarehouseView:false,
    //             warehouse_loaded:true
    //         })
    //     }
    //     let params = { employee_id: id }
    //     let res = await WarehouseServices.getWareHouseUsers(params);
    //     if (res.status == 200) {
    //         console.log("CPALLOders", res.data.view.data)

    //         res.data.view.data.forEach(element => {
    //             all_pharmacy_dummy.push(
    //                 {
    //                     warehouse: element.Warehouse,
    //                     name: element.Warehouse.name,
    //                     main_or_personal: element.Warehouse.main_or_personal,
    //                     owner_id: element.Warehouse.owner_id,
    //                     id: element.warehouse_id,
    //                     pharmacy_drugs_stores_id: element.Warehouse.pharmacy_drugs_store_id,
    //                 }

    //             )
    //         });
    //         console.log("warehouse", all_pharmacy_dummy)
    //         this.setState({
    //             allWarehouses:all_pharmacy_dummy
    //         })
    //     }
    // }

    componentDidMount() {
        if (localStorageService.getItem("Selected_Warehouse")) {
            let warehouseId = localStorageService.getItem("Selected_Warehouse")
            let filterData = this.state.filterData
            console.log('warehouse',warehouseId)
            // filterData.warehouse_id =warehouseId.id
            filterData.owner_id=warehouseId.owner_id
            this.setState({ 
                filterData
                
                },() =>{
                    this.loadItemEstimation()
                });
        }
       

        // this.loadWarehouses();
        // this.load_days(31)
        this.loadData()
      

    }

    render() {

        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        <Grid container spacing={2}>
                            <Grid item lg={12} xs={12} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="h6" className="font-semibold">Set Item Estimations</Typography>
                                {/* <LoonsButton
                                    color='primary'
                                onClick={() => {
                                    this.setState({
                                        selectWarehouseView:true,
                                        loaded:false
                                    })
                                    
                                }}
                                >
                                    <ApartmentIcon />
Chanage Warehouse
                                </LoonsButton> */}
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
                                            <Grid item="item" xs={12} sm={12} md={3} lg={3}>
                                                <SubTitle title="Ven" />
                                                <Autocomplete
                                        disableClearable className="w-full"
                                                    options={this.state.all_ven}
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
                                                    options={this.state.all_item_class}
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
                                                    options={this.state.all_item_category}
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
                                                    options={this.state.all_item_group}
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
                                                        option) => option.name
                                                            ? option.name
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
                                   
                                </Grid>
                            </ValidatorForm>
                            <ValidatorForm
                                    className="pt-2"
                                    onSubmit={() => null}
                                    onError={() => null}
                                >
                                    {/* Table Section */}
                                    <Grid container="container" className="mt-3 pb-5">
                                        <Grid item="item" lg={12} md={12} sm={12} xs={12}>
                                            {this.state.loaded?  
                                                 <LoonsTable
                                                        //title={"All Aptitute Tests"}
                                                        id={'allAptitute'}
                                                        data={this.state.data}
                                                        columns={this.state.columns}
                                                        options={{
                                                          
                                                            pagination: true,
                                                           
                                                            serverSide: true,
                                                            print: false,
                                                            viewColumns: true,
                                                            download: false,
                                                            count: this.state.totalItems,
                                                            rowsPerPage: this.state.filterData.limit,
                                                            page: this.state.filterData.page,
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
                                            <CircularProgress size={30}/>
                                        </Grid>
                                    )}
                                                  

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
                                            selectWarehouseView:false
                                        })
    
                                        this.loadWarehouses()
                                        this.setState({
                                            warehouse_loaded:true,
                                            selectedWarehouse:value
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

export default RMSDSetItemEstimations;