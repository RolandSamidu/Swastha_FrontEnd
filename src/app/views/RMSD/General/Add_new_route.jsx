import { Button, CircularProgress, Dialog, Divider, Grid, TextField, Typography } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import { CardTitle, LoonsCard, LoonsSnackbar, MainContainer } from 'app/components/LoonsLabComponents'
import LoonsButton from 'app/components/LoonsLabComponents/Button'
import localStorageService from 'app/services/localStorageService'
import WarehouseServices from 'app/services/WarehouseServices'
import React, { Component, Fragment } from 'react'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import ApartmentIcon from '@material-ui/icons/Apartment'
// import { useHistory } from 'react-router-dom';
import { withRouter } from 'react-router-dom';


class AddNewRoute extends Component {

   

    constructor(props) {
        super(props)
        this.state = {
            selectWarehouseView: false,
            warehouse_loaded: false,
            selectedWarehouse: null,
            updateStop: true,
            warehouse_id: null,
            rmsd_id: null,
            routeName: null,
            hospitals: [],
            allWarehouses: [],
            stops: [{
                warehouse_id: null,
                no: null,
                warehouse_name: null
            }
            ],
            alert: false,
            message: null,
            severity: null,
        }
    }


    componentDidMount() {
        this.loadWarehouses()
        // this.loadData()
    }

    async loadData(search) {
        this.setState({ updateStop: false })
        let params = { store_type: 'drug_store', main_or_personal: 'Main' };
        let owner_id = await localStorageService.getItem("owner_id")
        let user_info = await localStorageService.getItem("userInfo")
        let user_roles = user_info.roles;

        if (user_roles.includes("Drug Store Keeper")||user_roles.includes("'Chief MLT")||user_roles.includes("Chief Radiographer")) {
            params = { owner_id: owner_id, search:search };
        } else {
            params = { store_type: 'drug_store', main_or_personal: 'Main', search:search };
        }

        let warehouses = await WarehouseServices.getAllWarehouses(params)
        if (warehouses.status == 200) {
            console.log('Warehouses', warehouses.data.view.data)
            this.setState(
                { hospitals: warehouses.data.view.data, updateStop: true }
            )

        }
    }

    async createRoute() {

        // const history = useHistory();

        if (this.state.stops[0].warehouse_id == null) {
            this.setState({
                message: 'Please select at least one route',
                severity: 'Error',
                alert: true
            })
        } else {
            if (this.state.routeName == null || this.state.routeName.trim() === '') {
                this.setState({
                    message: 'Please add a name to the Route',
                    severity: 'Error',
                    alert: true
                })
            } else {

                let newRoute = await WarehouseServices.createRoute({
                    warehouse_id: this.state.warehouse_id,
                    rmsd_id: this.state.rmsd_id,
                    name: this.state.routeName.trim(),
                    no_of_stops: this.state.stops.length,
                    stops: this.state.stops
                })
                if (newRoute.status == 201) {
                    console.log('newRoute', newRoute.data)
                    if (newRoute.data.posted == "data has been added successfully.") {
                        this.setState({
                            message: 'Route Added Successfully',
                            severity: 'Success',
                            alert: true
                           
                        })
                        // history.push('/RMSD/general/all_routes')
                         this.props.history.push('/RMSD/general/all_routes');
                    } else {
                        this.setState({
                            message: 'Failed to Add the route. Please Try again',
                            severity: 'Error',
                            alert: true
                        })
                    }
                }
            }

        }

    }

    addStop() {
        this.setState({ updateStop: false })
        if (this.state.stops[this.state.stops.length - 1] && this.state.stops[this.state.stops.length - 1].warehouse_id == null || this.state.stops[this.state.stops.length - 1].warehouse_id == undefined) {
            this.setState({
                alert: true,
                severity: "Error",
                message: "No previous destinations"
            })
        } else {
            let empty = false
            this.state.stops.find((item) => {
                if (item.warehouse_id == null) {
                    empty = true
                }
            })
            if (empty) {
                this.setState({
                    alert: true,
                    severity: "Error",
                    message: "You have an Empty destination. Please fill or remove it first"
                })
            } else {
                this.state.stops.push({
                    warehouse_id: null,
                    no: null,
                    warehouse_name: null
                })
            }

        }
        this.setState({ updateStop: true })
        console.log("STOPS", this.state.stops);
    }

    removeStop(index) {
        this.setState({ updateStop: false })
        if (this.state.stops.length == 1) {
            this.setState({
                alert: true,
                severity: "Error",
                message: "At least 1 destination is required"
            })
        } else {
            this.state.stops.splice(index, 1)
            this.state.stops.forEach((item, index) => {
                this.state.stops[index].no = index + 1
            })
        }
        this.setState({ updateStop: true })
        console.log("STOPS", this.state.stops);
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
        console.log("selected warehouse", selected_warehouse_cache)
        if (!selected_warehouse_cache) {
            this.setState({
                selectWarehouseView: true
            })
        }
        else {
            this.state.warehouse_id = selected_warehouse_cache.id
            this.setState({
                selectWarehouseView: false,
                rmsd_id: selected_warehouse_cache.pharmacy_drugs_stores_id,
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
            // this.loadData()
        }
    }

    render() {
        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignContent: 'center' }}>
                            <Typography variant="h6" className="font-semibold">Add New Route</Typography>
                            {/* <LoonsButton
                                color='primary'
                                onClick={() => {
                                    this.setState({
                                        selectWarehouseView:true,
                                        updateStop:false,
                                        warehouse_loaded:false
                                    })
                                }}
                                >
                                    <ApartmentIcon />
                                   Chanage Warehouse
                                </LoonsButton>                         */}
                        </div>
                        <Divider className='mt-4 mb-4' />
                        {/* {this.state.warehouse_loaded ?  */}
                        <Grid container>
                            <Grid item lg={6} md={12} xs={12}>
                                <Grid container spacing={2}>
                                    {/* <Grid item lg={12} md={12} xs={12}>
                                        Route ID : AutoGenerated0001
                                    </Grid> */}
                                    <Grid item lg={12} md={12} xs={12} style={{ display: 'flex', alignItems: 'center' }}>
                                        Route Name : <TextField placeholder='Route Name' variant='outlined' size='small' className='ml-2' onChange={(e) => {
                                            if (e.target.value.trim() !== '') {
                                                this.setState({ routeName: e.target.value })
                                            } else {
                                                this.setState({ routeName: null })
                                            }

                                        }}></TextField>
                                    </Grid>
                                    <Grid item lg={12} md={12} xs={12}>
                                        <Grid container>
                                            <Grid item lg={2} md={2} xs={2}>Add Stops</Grid>
                                            <Grid item lg={10} md={10} xs={10}>
                                                <Grid container >
                                                    {/* this.state.updateStop ?  */}
                                                    {this.state.stops.map((row, index) => (
                                                        console.log("ROW", index, row),
                                                        <div style={{ display: 'flex', width: 'inherit', alignItems: 'center' }}>
                                                            <Grid item lg={1} md={1} xs={1}>{index + 1}</Grid>
                                                            <Grid item lg={2} md={2} xs={2}>{index + 1}{index == 0 ? "st" : index == 1 ? "nd" : index == 2 ? "rd" : "th"} Stop</Grid>
                                                            <Grid item lg={4} md={4} xs={4}>
                                                                <Autocomplete
                                                                    disableClearable
                                                                    options={this.state.hospitals}
                                                                    onChange={(e, value) => {

                                                                        let stops = this.state.stops
                                                                        let exist = false
                                                                        if (stops[index] && value != null) {
                                                                            stops.find(stop => {
                                                                                if (stop.warehouse_id == value.id) {
                                                                                    exist = true
                                                                                }
                                                                            })
                                                                            if (exist) {
                                                                                this.setState({
                                                                                    message: "Destination already exists on the route",
                                                                                    severity: 'Error',
                                                                                    alert: true
                                                                                })
                                                                            } else {
                                                                                stops[index].warehouse_id = value.id
                                                                                stops[index].no = index + 1
                                                                                stops[index].warehouse_name = value.name
                                                                            }

                                                                        } else {
                                                                            stops[index].warehouse_id = null
                                                                            stops[index].no = null
                                                                            stops[index].warehouse_name = null
                                                                        }
                                                                        this.setState({ stops })
                                                                    }}

                                                                    value={this.state.hospitals.find((v) => v.id == row.warehouse_id)}
                                                                    getOptionLabel={(
                                                                        option) => option.name
                                                                            ? option.name
                                                                            : ''}
                                                                    renderInput={(params) => (
                                                                        <TextField
                                                                            {...params}
                                                                            placeholder="Destination"
                                                                            variant="outlined"
                                                                            size="small"
                                                                            required="required" 
                                                                            onChange={(e)=>{
                                                                                if (e.target.value.length > 3) {
                                                                                    this.loadData(e.target.value)
                                                                                }
                                                                            }}
                                                                            />

                                                                    )} />
                                                            </Grid>
                                                            {this.state.stops.length - 1 == index ? <Grid item lg={2} md={2} xs={2}><Button style={{ backgroundColor: 'red', color: 'white' }} className='ml-2' onClick={() => {
                                                                console.log("INDEX", index);
                                                                this.removeStop(index)
                                                            }}>-</Button></Grid> : null}

                                                        </div>
                                                    )
                                                    )}
                                                    <Grid><LoonsButton onClick={() => { this.addStop() }}>+</LoonsButton></Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                           {/*  <Grid  item lg={6} md={12} xs={12}>
                                <Grid container>
                                    <Grid item lg={12} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}><h5 className='mr-2'>No of Stops: </h5><h4>{this.state.stops.length}</h4></Grid>
                                    <Grid item lg={12} style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                                        <Grid item lg={4}>
                                            <Grid container style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                <Grid item><h5>Number</h5></Grid>
                                                <Grid item><h4>23/4</h4></Grid>
                                            </Grid>
                                            <Grid item><Divider /></Grid>
                                        </Grid>
                                        <Grid item lg={4}>
                                            <Grid container style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                <Grid item><h5>Address Line 1</h5></Grid>
                                                <Grid item><h4>XXXXX</h4></Grid>
                                            </Grid>
                                            <Grid item><Divider /></Grid>
                                        </Grid>
                                        <Grid item lg={4}>
                                            <Grid container style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                <Grid item><h5>Address Line 1</h5></Grid>
                                                <Grid item><h4>XXXXX</h4></Grid>
                                            </Grid>
                                            <Grid item><Divider /></Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item lg={12}>
                                         <div class="mapouter"><div class="gmap_canvas"><iframe width="600" height="500" id="gmap_canvas" src="https://maps.google.com/maps?q=colombo&t=&z=13&ie=UTF8&iwloc=&output=embed" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"></iframe><a href="https://fmovies-online.net"></a><br />
                                        </div></div> 
                                    </Grid>
                                </Grid>
                            </Grid> */}
                        </Grid> 
                        {/* // : <Grid className="justify-center text-center w-full pt-12">
                        //     <CircularProgress size={30} />
                        // </Grid>} */}
                        <div className='mb-4'></div>

                        <div style={{ display: 'flex', justifyContent: 'flex-start' }}><LoonsButton onClick={() => { this.createRoute() }}>Save</LoonsButton></div>
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
                                            selectWarehouseView: false,
                                            warehouse_id: value.id,
                                            rmsd_id: value.pharmacy_drugs_stores_id,
                                        })

                                        this.loadWarehouses()
                                        this.setState({
                                            warehouse_loaded: true,
                                            selectedWarehouse: value
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

export default AddNewRoute