import { Dialog, Divider, Grid, IconButton, InputAdornment, Tooltip, Typography, CircularProgress } from '@material-ui/core'
import LoonsButton from 'app/components/LoonsLabComponents/Button'

import { withStyles } from '@material-ui/core/styles'
import React, { Component, Fragment } from 'react'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import SearchIcon from '@material-ui/icons/Search';
import { CardTitle, LoonsCard, LoonsTable, MainContainer, LoonsSnackbar } from 'app/components/LoonsLabComponents';
import VisibilityIcon from '@material-ui/icons/Visibility';
import AddIcon from '@material-ui/icons/Add';
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import ApartmentIcon from '@material-ui/icons/Apartment'
import { Autocomplete } from '@material-ui/lab';
import CloseIcon from '@material-ui/icons/Close';
import localStorageService from 'app/services/localStorageService';
import WarehouseServices from 'app/services/WarehouseServices';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline'

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

class CreateDistribution extends Component {
    constructor(props) {
        super(props)
        this.state = {
            alert: false,
            message: null,
            severity: null,

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
                search: null
            },

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
                    name: 'routeName',
                    label: 'Route Name',
                    options: {}
                },
                /* {   name: 'id',     
                    label: 'ID',     
                    options: {} 
                }, */
                {
                    name: 'status',
                    label: 'Status',
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
                                            window.location = '/RMSD/general/detailsView/' + this.state.routes_data[dataIndex].warehouse_id
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

                                <Tooltip title="View">
                                    <IconButton size="small" color="primary" aria-label="view"
                                        onClick={() => {
                                            this.deleteRoute(this.state.routes_data[dataIndex].id)
                                        }}
                                    >
                                        <DeleteOutlineIcon color="error" />
                                    </IconButton>
                                </Tooltip>
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
                }, {
                    name: 'Type',
                    label: 'Type',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.routes_data[dataIndex]?.Warehouse?.main_or_personal
                            return data
                        }
                    }
                }, {
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
        this.loadWarehouses()
        //this.loadRoutes()
        //this.loadData()
    }

    async deleteRoute(id) {
        this.setState({ updateStop: false })
        console.log("detete id", id)
        let res = await WarehouseServices.deleteRouteStop(id, {})
        console.log("res.data", res.data);
        if (res.status == 200) {
            this.setState({
                alert: true,
                message: res.data.view,
                severity: 'success',
            })
            this.setPage(0)
        } else {
            console.log();
            this.setState(
                { alert: true, message: "Item Could Not be Deleted. Please Try Again", severity: 'error' }
            )
        }
    }

    async loadData() {
        this.setState({ updateStop: false })
        let routes = await WarehouseServices.getRoutes({ warehouse_id: this.state.warehouse_id })
        if (routes.status == 200) {
            console.log('Warehouses', routes.data.view.data)
            this.setState(
                { data: routes.data.view.data, updateStop: true }
            )
        }
    }

    async loadRoutes() {
        this.setState({ routes_loaded: false, viewRoutes: false })
        let all_load_routes = [];
        let owner_id = await localStorageService.getItem('owner_id')

        let user_roles = await localStorageService.getItem('userInfo')?.roles

        let params = {
            owner_id: owner_id,
            page: this.state.formData?.page,
            limit: this.state.formData?.limit,
            search: this.state.formData?.search,

        }


        if (user_roles.includes('RMSD OIC') ||
            user_roles.includes('RMSD MSA') ||
            user_roles.includes('RMSD Pharmacist') ||
            user_roles.includes('RMSD Distribution Officer')
        ) {

        } else {
            params.rmsd_id = this.state.warehouse_id
        }



        let route_stops = await WarehouseServices.getRouteStops(params)
        if (route_stops.status == 200) {
            console.log("All Route Stops", route_stops.data.view.data)
            route_stops.data.view.data.forEach(element => {
                all_load_routes.push(
                    {
                        name: element.Warehouse.name,
                        code: element.Warehouse.Pharmacy_drugs_store.store_id,
                        routeName: element.DistributionRoute.name,
                        status: element.status,
                        warehouse_id: element.warehouse_id,
                        id: element.id

                    }
                )
            });
            console.log("Route Stops", all_load_routes)
            this.setState({
                routes_data: all_load_routes,
                routes_loaded: true,
                totalItems: route_stops.data.view.totalItems
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
            }, () => { this.loadRoutes() })
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
            // this.loadData()
            this.loadRoutes()
        }
    }



    render() {
        const { classes } = this.props
        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignContent: 'center' }}>
                            <Typography variant="h6" className="font-semibold">View Sections/Institutions</Typography>
                            <Grid
                                className="flex"
                            >
                                <Grid
                                    className="pt-2 pr-3"
                                >
                                    <Typography>{this.state.selectedWarehouseName !== null ? "You're in " + this.state.selectedWarehouseName : null}</Typography>
                                </Grid>
                                <LoonsButton
                                    color='primary'
                                    onClick={() => {
                                        this.setState({
                                            selectWarehouseView: true,
                                            updateStop: false,
                                            warehouse_loaded: false
                                        })
                                    }}
                                >
                                    <ApartmentIcon />
                                    Change Warehouse
                                </LoonsButton>
                            </Grid>
                        </div>
                        <Divider className='mt-4 mb-4' />

                        <Grid container>
                            <Grid item lg={12} md={12} xs={12} style={{ display: 'flex', alignItems: "center", justifyContent: 'flex-end' }}>
                                <ValidatorForm onSubmit={() => { this.loadRoutes() }}>
                                    <TextValidator className='' placeholder="Search"
                                        //variant="outlined"
                                        fullWidth="fullWidth" variant="outlined" size="small"
                                        // value={this.state.formData.search} 
                                        onChange={(e, value) => {
                                            let formData = this.state.formData
                                            if (e.target.value != '') {
                                                formData.search = e.target.value;
                                            } else {
                                                formData.search = null
                                            }
                                            this.setState({ formData })
                                            console.log("form dat", this.state.formData)
                                        }}

                                        // onKeyPress={(e) => {
                                        //     if (e.key == "Enter") {                                            
                                        //             this.loadOrderList()            
                                        //     }            
                                        // }}
                                        /* validators={[
                                        'required',
                                        ]}
                                        errorMessages={[
                                        'this field is required',
                                        ]} */
                                        value={this.state.formData.search}

                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={() => { this.loadRoutes() }}>
                                                        <SearchIcon />
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }} />
                                </ValidatorForm>
                            </Grid>
                        </Grid>
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
                                        }, () => { this.loadRoutes() })
                                        //this.loadData()

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
                <LoonsSnackbar
                    open={this.state.alert}
                    onClose={() => {
                        this.setState({ alert: false })
                    }}
                    message={this.state.message}
                    autoHideDuration={3000}
                    severity={this.state.severity}
                    elevation={2}
                    variant="filled"></LoonsSnackbar>
            </Fragment>
        )
    }
}

export default withStyles(styleSheet)(CreateDistribution)