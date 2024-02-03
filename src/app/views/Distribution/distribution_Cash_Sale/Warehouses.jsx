import { Dialog, Divider, Grid, IconButton, InputAdornment, Tooltip, Typography, CircularProgress } from '@material-ui/core'
import LoonsButton from 'app/components/LoonsLabComponents/Button'

import { withStyles } from '@material-ui/core/styles'
import React, { Component, Fragment } from 'react'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import SearchIcon from '@material-ui/icons/Search';
import { CardTitle, LoonsCard, LoonsTable, MainContainer, SubTitle } from 'app/components/LoonsLabComponents';
import VisibilityIcon from '@material-ui/icons/Visibility';
import AddIcon from '@material-ui/icons/Add';
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import ApartmentIcon from '@material-ui/icons/Apartment'
import { Autocomplete } from '@material-ui/lab';
import CloseIcon from '@material-ui/icons/Close';
import localStorageService from 'app/services/localStorageService';
import WarehouseServices from 'app/services/WarehouseServices';
import ClinicService from 'app/services/ClinicService';

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

})

class Warehouses extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectWarehouseView: false,
            warehouse_loaded: false,
            selectedWarehouse: null,
            selectedWarehouseName: null,
            warehouse_id: null,
            updateStop: false,
            viewRoutes: false,
            search: null,

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
                limit: 20,
                warehouse_id: null,
                search: null,
                owner_id:null
            },

            pharmacy_list:[],

            totalItems: 0,
            allWarehouses: [],
            data: [],
            columns: [
                // {   name: 'routeid',
                //     label: 'Route ID',
                //     options: {} 
                // },
                {
                    name: 'name',
                    label: 'Name',
                    options: {}
                },
                {
                    name: 'code',
                    label: 'Code',
                    options: {}
                },
                {
                    name: 'type',
                    label: 'Type',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            if (this.state.routes_data[dataIndex].type === 'drug_store') {
                              return <p>Drug Store</p>
                            } else if (this.state.routes_data[dataIndex].type === 'RMSD Main'){
                                return <p>RMSD</p>
                            }
                        }
                    }
                },
                /* {   name: 'id',     
                    label: 'ID',     
                    options: {} 
                }, */
                {
                    name: 'location',
                    label: 'Location',
                    options: {}
                },
                {
                    name: 'actions',
                    label: 'Actions',
                    options: {
                        customBodyRenderLite: (dataIndex) => (
                            <div className='flex'>
                                <Tooltip title="Add ">
                                    <IconButton size="small" color="primary" aria-label="view"
                                        onClick={() => {
                                            window.location = '/distribution/detailsView/' + this.state.routes_data[dataIndex].warehouse_id
                                            //this.loadStops(this.state.data[dataIndex].id)

                                        }}
                                    >
                                        <AddIcon />
                                    </IconButton>
                                </Tooltip>
                                {/* <Tooltip title="View">
                                    <IconButton size="small" color="primary" aria-label="view"
                                        onClick={() => {
                                            window.location = '/RMSD/create_order/' + this.state.routes_data[dataIndex].warehouse_id
                                            //this.loadStops(this.state.data[dataIndex].id)

                                        }}
                                    >
                                        <VisibilityIcon />
                                    </IconButton>
                                </Tooltip> */}
                            </div>
                        )
                    }
                },
            ],
            routes_data: [],
            routes_columns: [
                // {   name: 'routeid',
                //     label: 'Route ID',
                //     options: {} 
                // },
                {
                    name: 'name',
                    label: 'Name',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.routes_data[dataIndex]?.Warehouse?.name
                            return data
                        }
                    }
                },
                /*  {
                    name: 'Type',
                    label: 'Type',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.routes_data[dataIndex]?.Warehouse?.main_or_personal
                            return data
                        }
                    }
                }, */
                 {
                    name: 'actions',
                    label: 'Actions',
                    options: {
                        customBodyRenderLite: (dataIndex) => (
                            <Tooltip title="View">
                                <IconButton size="small" aria-label="view"
                                    onClick={() => {
                                        console.log("adsa", this.state.routes_data[dataIndex])
                                        let warehouse_id = this.state.routes_data[dataIndex].warehouse_id
                                        window.location = '/RMSD/create_order/' + warehouse_id;
                                    }}
                                ><VisibilityIcon />
                                </IconButton>
                            </Tooltip>
                        )
                    }
                },
            ],
        }
    }

    componentDidMount() {
        //this.loadWarehouses()
        this.loadRoutes()
        //this.loadData()
    }

   /*  async loadData() {
        this.setState({ updateStop: false })
        let routes = await WarehouseServices.getRoutes({ warehouse_id: this.state.warehouse_id })
        if (routes.status == 200) {
            console.log('Warehouses', routes.data.view.data)
            this.setState(
                { data: routes.data.view.data, updateStop: true }
            )
        }
    } */

    async loadRoutes() {
        this.setState({ routes_loaded: false, viewRoutes: false })
        let all_load_routes = [];
        let owner_id = this.state.formData.owner_id
        let userInfo = await localStorageService.getItem('userInfo')

        let params = this.state.formData
        params.owner_id = this.state.formData.owner_id
        params.issuance_type = ['drug_store', 'RMSD Main']
        params.search = this.state.formData?.search

        console.log("All warehouses", this.state.formData.owner_id)

        let data = {
            type: "MSD"
        }

        let warehouse = await WarehouseServices.getWarehoureWithOwnerId(owner_id,params)
        if (warehouse.status == 200) {
            console.log("All warehouses", warehouse.data.view.data)
            warehouse.data.view.data.forEach(element => {
                all_load_routes.push(
                    {
                        name: element.name,
                        code: element.Pharmacy_drugs_store.store_id,
                        type: element.Pharmacy_drugs_store.issuance_type,
                        location: element.Pharmacy_drugs_store.location,
                        warehouse_id: element.id
                    }
                )
            });
            console.log("Route Stops", all_load_routes)
            this.setState({
                routes_data: all_load_routes,
                routes_loaded: true,
                totalItems: warehouse.data.view.totalItems
            })
        }
    }

    async loadStops(id) {
        this.setState({ routes_loaded: false, viewRoutes: false })
        let stops = await WarehouseServices.getSingleRoutes(id, { warehouse_id: this.state.warehouse_id })
        if (stops.status == 200) {
            console.log('routes', stops.data.view.DistributionRouteStops)
            const data = stops.data.view.DistributionRouteStops;

            this.setState({
                routes_data: data,
                routes_loaded: true
            })
        }
    }

    async setPage(page) {
        console.log(page);
        //Change paginations
        let formData = this.state.formData
        formData.page = page
        this.setState({
            formData
        }, () => {
            console.log("New formdata", this.state.formData)
            this.loadRoutes()
        })
    }

    async getPharmacyDetails(search) {
        let params = {
            limit: 500,
            page: 0,
            issuance_type: ['Hospital', 'RMSD Main', 'MSD Main'],
            search: search
        };

        let res = await ClinicService.fetchAllClinicsNew(params, null);

        if (res.status === 200) {
            console.log('phar------------------>>>>> check', res);

            this.setState({
                pharmacy_list: res.data.view.data
            });
        }
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
            this.state.warehouse_id = selected_warehouse_cache.id
            this.setState({
                selectWarehouseView: false,
                selectedWarehouseName: selected_warehouse_cache.name,
                warehouse_loaded: true
            })
        }
        let params = { employee_id: id }
        let res = await WarehouseServices.getWareHouseUsers(params);
        if (res.status == 200) {
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
            //this.loadData()
        }
    }

    // search function
    // loadOrderList = (event) => {
    //     const { value } = event.target;
    //     const filteredData = this.state.routes_data.filter((item) =>
    //         item.name.toLowerCase().includes(value.toLowerCase())
    //     );
    //     this.setState({ search: value, filteredData });
    // };



    render() {
        const { classes } = this.props
        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                    <CardTitle title="Create Distribution" />
                        
                            <ValidatorForm
                            onSubmit={() => this.loadRoutes()}
                            >
                                <Grid container>
                                    <Grid item className="px-2" lg={4} md={4} sm={12} xs={12}>
                                        <SubTitle title="Institution" />
                                        <Autocomplete
                                            disableClearable
                                            className="w-full"
                                            options={this.state.pharmacy_list || []} 
                                            onChange={(e, value) => {
                                                if (value != null) {
                                                    let formData = this.state.formData;
                                                    formData.owner_id = value.owner_id;
                                                    this.setState({ formData });
                                                } else {
                                                    let formData = this.state.formData;
                                                    formData.owner_id = null;
                                                    this.setState({ formData });
                                                }
                                            }}
                                            value={
                                                this.state.all_pharmacy &&
                                                this.state.all_pharmacy.find((v) => v.owner_id === this.state.formData.owner_id)
                                            }
                                            getOptionLabel={(option) => (option && option.name ? (option.name + ' - ' + option?.Department?.name) : '')}
                                            renderInput={(params) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="Institution"
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    onChange={(e) => {
                                                        if (e.target.value.length > 3) {
                                                            this.getPharmacyDetails(e.target.value);
                                                        }
                                                    }}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid
                                        item="item"
                                        lg={4} md={4} sm={12} xs={12}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'flex-end'
                                        }}>
                                        <LoonsButton type="submit"
                                        onClick={()=>{
                                            this.setPage(0)
                                        }}
                                        >
                                            <span className="capitalize">Filter</span>
                                        </LoonsButton>
                                    </Grid>
                                </Grid>

                                <Grid container style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Grid item className="px-2" lg={4} md={4} sm={12} xs={12} >
                                        <TextValidator className='' placeholder="Search"
                                        //variant="outlined"
                                        fullWidth="fullWidth" variant="outlined" size="small"
                                        value={this.state.formData.search}
                                        // value={this.state.search} 
                                        // onChange={
                                        //     this.loadOrderList
                                        // }
                                        onChange={(e) => {
                                            let formData = this.state.formData
                                            formData.search = e.target.value
                                            this.setState({ formData })
                                            console.log('abc', this.state.formData)
                                        }}
                                        //     validators={[
                                        // 'required',
                                        // ]}
                                        // errorMessages={[
                                        // 'this field is required',
                                        // ]} 
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <SearchIcon></SearchIcon>
                                                </InputAdornment>
                                            )
                                        }} />
                                    </Grid>
                                </Grid>

                            </ValidatorForm>
                          
                        <Grid container="container" className="mt-3 pb-5">
                            <Grid item="item" lg={12} md={12} sm={12} xs={12}>
                                {this.state.routes_loaded ? <LoonsTable
                                    // data={this.state.routes_data}
                                    data={this.state.filteredData ? this.state.filteredData : this.state.routes_data}
                                    // data = {this.state.filteredData.length ? this.state.filteredData : this.state.data}
                                    columns={this.state.columns}
                                    options={{
                                        pagination: true, 
                                        size: 'medium',
                                        viewColumns: true,
                                        download: true,
                                        serverSide: true,
                                        count: this.state.totalItems,
                                        rowsPerPage: this.state.formData.limit,
                                        page: this.state.formData.page,
                                        onTableChange: (action, tableState) => {
                                            console.log(action, tableState)
                                            switch (action) {
                                                case 'changePage':
                                                    this.setPage(tableState.page)
                                                    break
                                                default:
                                                    console.log('action not handled.')
                                            }
                                        }
                                    }}
                                >
                                </LoonsTable> : (
                                    <Grid className="justify-center text-center w-full pt-12">
                                        <CircularProgress size={30} />
                                    </Grid>
                                )}
                            </Grid></Grid>
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
                                options={this.state.allWarehouses.sort((a, b) => (a.name.localeCompare(b.name)))}
                                onChange={(e, value) => {
                                    if (value != null) {
                                        localStorageService.setItem('Selected_Warehouse', value);
                                        this.setState({
                                            selectWarehouseView: false,
                                            warehouse_id: value.id
                                        })

                                        this.loadWarehouses()
                                        this.setState({
                                            warehouse_loaded: true,
                                            selectedWarehouse: value,
                                            selectedWarehouseName: value.name
                                        })
                                        //this.loadData()
                                        this.loadRoutes()
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

                {/* <Dialog
                    fullWidth="fullWidth"
                    maxWidth="sm"
                    open={this.state.viewRoutes}>

                    <MuiDialogTitle disableTypography className={classes.Dialogroot}>
                        <CardTitle title="Drug Store" />

                        <IconButton aria-label="close" className={classes.closeButton} onClick={() => { this.setState({ viewRoutes: false }) }}>
                            <CloseIcon />
                        </IconButton>

                    </MuiDialogTitle>

                    <div className="w-full h-full px-5 py-5">

                        {this.state.routes_loaded ? <LoonsTable
                            data={this.state.routes_data}
                            columns={this.state.routes_columns}
                        >
                            {console.log(this.state)}

                        </LoonsTable>
                            : null}
                    </div>
                </Dialog> */}
            </Fragment>
        )
    }
}

export default withStyles(styleSheet)(Warehouses)