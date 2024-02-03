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

import QACurrentRequests from './QACurrentRequests'
import QAArchivedRequests from './QAArchivedRequests'
const styleSheet = (theme) => ({})

class AllQA_hospital extends Component {
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
            user_type: null

        }

    }

    async componentDidMount() {
        let login_user_info = localStorageService.getItem('userInfo').roles
        this.setState({ login_user_roles: login_user_info })

        // let user_type = localStorageService.getItem('userInfo').type
        // console.log("type",user_type)

        if (login_user_info.includes('Chief Pharmacist') || login_user_info.includes('Hospital Director')) {
            let owner_id = await localStorageService.getItem('owner_id')
            console.log("ownerid", owner_id)
            this.setState({

                owner_id2: owner_id,
                Loaded: true
            })
        } else if (
            login_user_info.includes('MSD SCO') || login_user_info.includes('MSD SCO Distribution') ||
            login_user_info.includes('MSD SCO QA') || login_user_info.includes('MSD SCO Supply') ||
            login_user_info.includes('MSD SCO Distribution')) {
            this.setState({
                owner_id2: '000',
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
                    <LoonsCard>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            {/* <Typography variant="h6" className="font-semibold">My Stocks</Typography> */}
                        </div>
                        <Divider />
                        <AppBar position="static" color="default" className="mt-2">
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

                                    <Tab label={<span className="font-bold text-12">Current</span>} />
                                    <Tab label={<span className="font-bold text-12">Archived</span>} />

                                </Tabs>
                            </Grid>
                        </AppBar>

                        <main>

                            {/* {this.state.Loaded ? */}
                            <div>
                                {this.state.activeTab == 0 ?
                                    <div className='w-full'>
                                        <QACurrentRequests />
                                    </div>
                                    : null
                                }
                                {this.state.activeTab == 1 ?
                                    <div className='w-full'>
                                        <QAArchivedRequests />
                                    </div> : null
                                }

                            </div>
                            {/* : null} */}
                        </main>
                    </LoonsCard>
                </MainContainer>
            </Fragment>

        )
    }
}

export default withStyles(styleSheet)(AllQA_hospital)
