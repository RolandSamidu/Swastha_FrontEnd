import { Dialog, Divider, Grid, IconButton, InputAdornment, Tooltip, Typography } from '@material-ui/core'
import LoonsButton from 'app/components/LoonsLabComponents/Button'

import { withStyles } from '@material-ui/core/styles'
import React, { Component, Fragment } from 'react'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import SearchIcon from '@material-ui/icons/Search';
import { CardTitle, LoonsCard, LoonsTable, MainContainer, LoonsSnackbar } from 'app/components/LoonsLabComponents';
import VisibilityIcon from '@material-ui/icons/Visibility';
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import ApartmentIcon from '@material-ui/icons/Apartment'
import { Autocomplete } from '@material-ui/lab';
import CloseIcon from '@material-ui/icons/Close';
import localStorageService from 'app/services/localStorageService';
import WarehouseServices from 'app/services/WarehouseServices';

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


class AllRoute extends Component {
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
            formData: {
                search: null,
            },
            totalItems: 0,
            search: '',
            filteredData: {
                 warehouse_id: null, 
                 'order[0]': ['createdAt', 'DESC'],
                 page:0, 
                 limit:25
            },// filtered data based on search query


            allWarehouses: [],
            data: [],
            columns: [
                // {   name: 'routeid',
                //     label: 'Route ID',
                //     options: {} 
                // },
                {
                    name: 'name',
                    label: 'Route Name',
                    options: {

                    }
                }, {
                    name: 'no_of_stops',
                    label: 'No of Stops',
                    options: {

                    }
                },
                /* {   name: 'id',     
                    label: 'ID',     
                    options: {} 
                }, */

                {
                    name: 'status',
                    label: 'Status',
                    options: {

                    }
                }, {
                    name: 'actions',
                    label: 'Actions',
                    options: {
                        customBodyRenderLite: (dataIndex) => (
                            <Tooltip title="View">
                                <IconButton size="small" aria-label="view"
                                    onClick={() => {
                                        //window.location = '/RMSD/general/add_route'
                                        this.loadStops(this.state.data[dataIndex].id)
                                        console.log("slected data", this.state.data[dataIndex])
                                    }}
                                >
                                    <VisibilityIcon />
                                </IconButton>
                            </Tooltip>
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
                }, 
                /* {
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
                                >
                                    <VisibilityIcon />
                                </IconButton>
                            </Tooltip>
                        )
                    }
                }, */

            ],
            alert: false,
            message: null,
            severity: null,


        }
    }

    componentDidMount() {
        this.loadWarehouses()
        //this.loadData()
    }

    async loadData() {
        this.setState({ updateStop: false })

        let filteredData = this.state.filteredData
        filteredData.warehouse_id = this.state.warehouse_id

        this.setState({
            filteredData
        })
        
        let routes = await WarehouseServices.getRoutes(this.state.filteredData)
        if (routes.status == 200) {
            console.log('Warehouses', routes)
            this.setState(
                { 
                    data: routes.data.view.data, 
                    updateStop: true,
                    totalItems:routes.data.view.totalItems
                }
            )

        }
    }



    async loadStops(id) {
        this.setState({ routes_loaded: false, viewRoutes: true })
        let stops = await WarehouseServices.getSingleRoutes(id, { warehouse_id: this.state.warehouse_id })
        if (stops.status == 200) {
            console.log('routes', stops.data.view.DistributionRouteStops)
            this.setState(
                { routes_data: stops.data.view.DistributionRouteStops, routes_loaded: true }
            )

        }
    }


    loadOrderList = (event) => {
        const { value } = event.target;
        const filteredData = this.state.data.filter((item) =>
            item.name.toLowerCase().includes(value.toLowerCase())
        );
        this.setState({ search: value, filteredData });
    };


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
            this.loadData()
        }
    }

    async addDefaultRoutes() {
        var owner_id = await localStorageService.getItem('owner_id');
       
        let newRoute = await WarehouseServices.createRouteBulk({
            warehouse_id: this.state.warehouse_id,
            owner_id: owner_id
        })
        if (newRoute.status == 201) {
            this.setState({
                message: 'Route Added Successfully',
                severity: 'Success',
                alert: true

            },()=>{
                this.loadData()
            })
        } else {
            this.setState({
                message: 'Route Not Added',
                severity: 'error',
                alert: true

            })
        }
    }

    async setPage(page) {
        console.log(page);
        //Change paginations
        let filteredData = this.state.filteredData
        filteredData.page = page
        this.setState({
            filteredData
        }, () => {
            // console.log("New formdata", this.state.formData)
            this.loadData()
        })
    }

    render() {

        const { classes } = this.props

        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignContent: 'center' }}>
                            <Typography variant="h6" className="font-semibold">Add New Route</Typography>
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
                                <ValidatorForm>
                                    <TextValidator className='' placeholder="Search"
                                        //variant="outlined"
                                        fullWidth="fullWidth" variant="outlined" size="small"
                                        // value={this.state.formData.search}
                                        value={this.state.search}
                                        onChange={
                                            this.loadOrderList
                                            //     (e, value) => {
                                            //     let formData = this.state.formData
                                            //     if (e.target.value != '') {
                                            //         formData.search = e.target.value;
                                            //     }else{
                                            //         formData.search = null
                                            //     }                     
                                            //     this.setState({formData})
                                            //     console.log("form dat", this.state.formData)
                                            // }
                                        }

                                        // onKeyPress={(e) => {
                                        //     if (e.key == "Enter") {                                            
                                        //               this.loadOrderList()         
                                        //     }            
                                        // }}
                                        validators={[
                                            'required',
                                        ]}
                                        errorMessages={[
                                            'this field is required',
                                        ]}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <SearchIcon></SearchIcon>
                                                </InputAdornment>
                                            )
                                        }} />

                                </ValidatorForm>
                                <Grid container className='ml-4' spacing={2}>
                                    <Grid item>
                                        <LoonsButton onClick={() => {
                                            window.location = '/RMSD/general/add_route'
                                        }}>Add New Route</LoonsButton>
                                    </Grid>

                                    <Grid item>
                                        <LoonsButton onClick={() => {
                                            this.addDefaultRoutes()
                                        }}>Add Default Routes</LoonsButton>
                                    </Grid>
                                </Grid>

                            </Grid>
                        </Grid>
                        <LoonsTable
                            // data={this.state.data}
                            data={this.state.filteredData.length ? this.state.filteredData : this.state.data}
                            // data = {filteredData}
                            columns={this.state.columns}
                            options={{
                                pagination: true,
                                size: 'medium',
                                viewColumns: true,
                                download: true,
                                serverSide: true,
                                count: this.state.totalItems,
                                rowsPerPage: this.state.filteredData.limit,
                                page: this.state.filteredData.page,
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

                        </LoonsTable>
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
                                            selectWarehouseView: false,
                                            warehouse_id: value.id
                                        })

                                        this.loadWarehouses()
                                        this.setState({
                                            warehouse_loaded: true,
                                            selectedWarehouse: value,
                                            selectedWarehouseName: value.name
                                        })
                                        this.loadData()

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

                        </LoonsTable>
                            : null}


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
                    variant="filled"></LoonsSnackbar>



            </Fragment>
        )
    }
}

export default withStyles(styleSheet)(AllRoute)