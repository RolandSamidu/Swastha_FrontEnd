import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Autocomplete, createFilterOptions } from '@material-ui/lab'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import SearchIcon from '@material-ui/icons/Search'
import AppBar from '@material-ui/core/AppBar'
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import ApartmentIcon from '@material-ui/icons/Apartment';



import {
    Grid,
    Stepper,
    Step,
    StepLabel,
    StepButton,
    FormControlLabel,
    Radio,
    RadioGroup,
    Divider,
    Badge,
    CircularProgress,
    IconButton,
    Icon,
    Tabs,
    InputAdornment,
    Tab,
    Dialog,
    Typography
} from '@material-ui/core'
import {
    DatePicker,
    Button,
    LoonsSnackbar,
    MainContainer,
    LoonsCard,
    CardTitle,
    SubTitle,
    ImageView,
    LoonsTable,

} from 'app/components/LoonsLabComponents'

import WarehouseServices from "app/services/WarehouseServices";
import localStorageService from "app/services/localStorageService";
import LoonsButton from 'app/components/LoonsLabComponents/Button'

import ItemStock from './ItemStock'
import DetailsView from './DetailsView'
import UnuserbleDrugs from './UnuserbleDrugs'

const styleSheet = (theme) => ({})

class MyStok extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeTab: 0,
            activeSecondaryTab: 0,
            Loaded: false,
            selected_warehouse: null,
            selected_warehouse_name: null,
            owner_id: null,
            dialog_for_select_warehouse: false,
            all_warehouse_loaded: [],
            login_user_roles: [],
            owner_id: null,
            owner_id2: null,
            user_type: null,
            warehouse_selecteble: true,

        }

    }

    async componentDidMount() {

        let login_user_info = await localStorageService.getItem('userInfo').roles
        this.setState({ login_user_roles: login_user_info })
        let owner_id = await localStorageService.getItem('owner_id')
        // let user_type = localStorageService.getItem('userInfo').type
        // console.log("type",user_type)

        if (login_user_info.includes('Chief Pharmacist') || login_user_info.includes('Hospital Director')) {
            console.log("ownerid", owner_id)
            this.setState({

                owner_id2: owner_id,
                Loaded: true
            })
        } else if (
            login_user_info.includes('MSD SCO') || login_user_info.includes('MSD SCO Distribution') ||
            login_user_info.includes('MSD SCO QA') || login_user_info.includes('MSD SCO Supply') ||
            login_user_info.includes('Distribution Officer') || login_user_info.includes('MSD Distribution Officer')
            || login_user_info.includes('MSD AD')
            || login_user_info.includes('MSD Director')
            || login_user_info.includes('Chief Radiographer')
        ) {
            this.setState({
                owner_id2: owner_id,
                warehouse_selecteble: false,
                Loaded: true,

            })
        } else {
            this.loadWarehouses()
        }

    }

    async loadWarehouses() {
        this.setState({ Loaded: false })
        var user = await localStorageService.getItem('userInfo');
        console.log('user', user)
        var id = user.id;
        var all_pharmacy_dummy = [];
        var selected_warehouse_cache = await localStorageService.getItem('Selected_Warehouse');
        if (!selected_warehouse_cache) {
            this.setState({ dialog_for_select_warehouse: true })
        }
        else {
            this.setState({
                owner_id: selected_warehouse_cache.owner_id, selected_warehouse: selected_warehouse_cache.id, dialog_for_select_warehouse: false, Loaded: true,
                selected_warehouse_name: selected_warehouse_cache.name
            })
        }
        let params = { employee_id: id }
        let res = await WarehouseServices.getWareHouseUsers(params);
        if (res.status == 200) {
            console.log("warehouseUsers", res.data.view.data)

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
            this.setState({ all_warehouse_loaded: all_pharmacy_dummy })
        }
    }

    changeType(type) {
        this.setState({ type: type, Loaded: false })

        setTimeout(() => {
            this.setState({ Loaded: true })
        }, 500)
        //this.setState({Loaded:true})
    }

    render() {

        return (

            <Fragment>
                <MainContainer>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <Typography variant="h6" className="font-semibold">My Stocks </Typography>
                        {/* {
                             this.state.login_user_info.includes('MSD SCO')||this.state.login_user_info.includes('MSD SCO Distribution')||
                             this.state.login_user_info.includes('MSD SCO QA')||this.state.login_user_info.includes('MSD SCO Supply')||
                             this.state.login_user_info.includes('MSD SCO Distribution') 
                            ? null :  */}
                        <div className='flex'>
                            <Grid className='pt-2 pr-3'
                            >
                                <Typography>{this.state.selected_warehouse_name !== null ? "You're in " + this.state.selected_warehouse_name : null}</Typography>
                            </Grid>

                            {(!this.state.login_user_roles.includes('Chief Pharmacist') && this.state.warehouse_selecteble) &&
                                <LoonsButton
                                    color='primary'
                                    onClick={() => {
                                        this.setState({ dialog_for_select_warehouse: true, Loaded: false })
                                    }}>
                                    <ApartmentIcon />
                                    Change Warehouse
                                </LoonsButton>
                            }


                        </div>
                        {/* } */}

                    </div>
                    <Divider />
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

                                <Tab label={<span className="font-bold text-12">Summary</span>} />
                                <Tab label={<span className="font-bold text-12">Detail View</span>} />
                                <Tab label={<span className="font-bold text-12">Unserviceable Drugs</span>} />

                            </Tabs>
                        </Grid>
                    </AppBar>

                    <main>

                        {this.state.Loaded ?
                            <div>
                                {this.state.activeTab == 0 ?
                                    <div className='w-full'>

                                        <ItemStock warehouse_id={this.state.selected_warehouse} owner_id={this.state.owner_id2}></ItemStock>
                                    </div>
                                    : null
                                }
                                {this.state.activeTab == 1 ?
                                    <div className='w-full'>
                                        <DetailsView warehouse_id={this.state.selected_warehouse} owner_id={this.state.owner_id2}></DetailsView>
                                    </div> : null
                                }
                                {this.state.activeTab == 2 ?
                                    <div className='w-full'>
                                        <UnuserbleDrugs warehouse_id={this.state.selected_warehouse} owner_id={this.state.owner_id2}></UnuserbleDrugs>
                                    </div> : null
                                }
                            </div>
                            : null}
                    </main>

                    <Dialog fullWidth maxWidth="sm" open={this.state.dialog_for_select_warehouse} >

                        <MuiDialogTitle disableTypography>
                            <CardTitle title="Select Your Warehouse" />
                        </MuiDialogTitle>



                        <div className="w-full h-full px-5 py-5">
                            <ValidatorForm
                                onError={() => null}
                                className="w-full">
                                <Autocomplete
                                    disableClearable
                                    className="w-full"
                                    options={this.state.all_warehouse_loaded.sort((a, b) => (a.name.localeCompare(b.name)))} // sort by name
                                    onChange={(e, value) => {
                                        if (value != null) {
                                            localStorageService.setItem('Selected_Warehouse', value);
                                            this.setState({ dialog_for_select_warehouse: false, Loaded: true, selected_warehouse: value.id, selected_warehouse_name: value.name })
                                        }
                                    }}
                                    value={{
                                        name: this.state.selected_warehouse ? (this.state.all_warehouse_loaded.filter((obj) => obj.id == this.state.selected_warehouse).name) : null,
                                        id: this.state.selected_warehouse
                                    }}
                                    getOptionLabel={(option) => option.name != null ? option.name + " - " + option.main_or_personal : null}
                                    renderInput={(params) => (
                                        <TextValidator
                                            {...params}
                                            placeholder="Select Your Warehouse"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                        />
                                    )}
                                />

                            </ValidatorForm>
                        </div>
                    </Dialog>
                </MainContainer>
            </Fragment>

        )
    }
}

export default withStyles(styleSheet)(MyStok)