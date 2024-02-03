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
import LoonsButton from 'app/components/LoonsLabComponents/Button';

import MyStock from './TabComponents/MyStock/MyStock';
import AllOrders from '../orders/AllOrders';
import DistributionAllOrders from '../MSD_Medical_Supply_Assistant/MSD_MSA'



const styleSheet = (theme) => ({})

class MyStockNew extends Component {
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

        this.loadWarehouses()

    }

    async loadWarehouses() {
        this.setState({ Loaded: false })
        var user = await localStorageService.getItem('userInfo');
        console.log('user', user)

        const query = new URLSearchParams(this.props.location.search);
        const searchOwnerId = query.get('owner_id')

        let params = { owner_id: searchOwnerId }
        let res = await WarehouseServices.getWarehoureWithOwnerId(searchOwnerId, params)
        console.log("CPALLOders", res)

        if (res.status == 200) {
            console.log("CPALLOders", res.data.view.data)

            // console.log("warehouse", all_pharmacy_dummy)
            this.setState({
                all_warehouse_loaded: res.data.view.data,

                dialog_for_select_warehouse: true
            })
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
                            <Typography variant="h6" className="font-semibold">Pre Stock Check </Typography>

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

                                    <Tab label={<span className="font-bold text-12">My Stock</span>} />
                                    <Tab label={<span className="font-bold text-12">Order Details ( IN )</span>} />
                                    <Tab label={<span className="font-bold text-12">Request Details ( OUT )</span>} />

                                </Tabs>
                            </Grid>
                        </AppBar>

                        <main>

                            {this.state.Loaded ?
                                <div>
                                    {this.state.activeTab == 0 ?
                                        <div className='w-full'>
                                            <MyStock />

                                        </div>
                                        : null
                                    }
                                    {this.state.activeTab == 1 ?
                                        <div className='w-full'>
                                            <AllOrders type="Order" />
                                        </div> : null
                                    }
                                    {this.state.activeTab == 2 ?
                                        <div className='w-full'>
                                            <DistributionAllOrders type="Order" />
                                        </div> : null
                                    }
                                </div>
                                : <CircularProgress />}
                        </main>
                    </LoonsCard>
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

                                        this.setState({
                                            Loaded: false
                                        })
                                        console.log("selected", value)
                                        if (value != null) {
                                            localStorageService.setItem('Selected_Warehouse', value);
                                            setTimeout(() => {
                                                this.setState({
                                                    dialog_for_select_warehouse: false,
                                                    selected_warehouse: value.id, selected_warehouse_name: value.name,
                                                    Loaded: true,
                                                })
                                            }, 1000)





                                        }
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

export default withStyles(styleSheet)(MyStockNew)