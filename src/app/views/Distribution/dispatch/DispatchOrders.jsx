import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import ChiefPharmacistServices from "app/services/ChiefPharmacistServices";
import { dateTimeParse, dateParse } from "utils";
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import SearchIcon from '@material-ui/icons/Search';
import { Autocomplete } from "@material-ui/lab";
import LoonsDatePicker from "app/components/LoonsLabComponents/DatePicker";
import DispatchModel from './DispatchModel'

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
import ClinicService from 'app/services/ClinicService';




const styleSheet = (theme) => ({})

class DispatchOrders extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dispatch: false,

            alert: false,
            message: '',
            severity: 'success',

            all_institiutes: [],

            Loaded: true,
            selected_warehouse: null,
            dialog_for_select_warehouse: false,
            all_warehouse_loaded: [],
            all_drug_stores: [],
            all_pharmacy: [],
            data: [],
            selected_id:[],
            pharmacy_list:[],
            // owner_id: null,
            formData: {
                limit: 20,
                page: 0,
                to_owner_id: '000',
                owner_id: null,
                //owner_id: null,
                // approval_status: this.props.status,
                // 'order[0]': [
                //     'updatedAt', 'DESC'
                // ], 
                to: null,
                from_date: null,
                to_date: null,
                status: "ISSUED",
                date_type: null,
                from: null,
                search: null
            },
            all_status: [
                 {
                    id: 1,
                    name: 'ISSUED'
                }
            ],
            approveOrder: {
                order_exchange_id: this.props.match.params.id, 
                other_remark: null,
                type: 'APPROVED_SUP',
            },
            columns: [
                {
                    name: 'select_id',
                    label: 'Select',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            if (this.state.data) {
                                return <input
                                type="checkbox"
                                style={{width: "20px",
                                    height: "20px", outline: "none",
                                    cursor: "pointer"}}
                                value={this.state.data[dataIndex]?.id
                                }
                                onChange={this.handleChange}
                              />
                            } else {
                                return "N/A"
                            }

                        }
                    }
                }, 
                {
                    name: 'pharmacy',
                    label: 'Pharmacy',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if (this.state.data) {
                                return (this.state.data[tableMeta.rowIndex]?.fromStore?.name)
                            } else {
                                return "N/A"
                            }

                        }
                    }
                }, 
                {
                    name: 'warehouse',
                    label: 'Warehouse',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if (this.state.data) {
                                return (this.state.data[tableMeta.rowIndex]?.toStore?.name)
                            } else {
                                return "N/A"
                            }

                        }
                    }
                }, 
          
                {
                    name: 'order_id',
                    label: 'Order ID',
                    options: {
                        display: true
                    }
                }
                // ,{
                //     name: 'pharmacist_name',
                //     label: 'Counter Pharmacist',
                //     options: {
                //         display: true,
                //         customBodyRender: (value, tableMeta, updateValue) => {
                //             return (this.state.data[tableMeta.rowIndex].Employee.name)
                //         }
                //     }
                // }
                , {
                    name: 'number_of_items',
                    label: 'Number of Items',
                    options: {
                        display: true
                    }
                },
                //  {
                //     name: 'allocated_items',
                //     label: 'Allocated Items',
                //     options: {
                //         display: true
                //     }
                // },
                //  {
                //     name: 'dropped_items',
                //     label: 'Dropped Items',
                //     options: {
                //         display: true
                //     }
                // },
                 {
                    name: 'required_date',
                    label: 'Required Date',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            if (this.state.data) {
                                let data = this
                                    .state
                                    .data[dataIndex]
                                    ?.required_date;
                                if (data) {
                                    return <p>{dateTimeParse(data)}</p>
                                } else {
                                    return "N/A"
                                }
                            } else {
                                return "N/A"
                            }


                        }
                    }
                }, {
                    name: 'issued_date',
                    label: 'Issue Date',
                    options: {
                        display: true
                    }
                
                
                }, {
                    name: 'delivery_mode',
                    label: 'Delivery Mode',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            return this.state.data[dataIndex]?.Delivery?.delivery_mode
                        }
                    }
                }, {
                    name: 'status',
                    label: 'Status',
                    options: {
                        display: true
                    }
                }, {
                    name: 'action',
                    label: 'Action',
                    options: {
                        // filter: true,
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (<> < IconButton className="text-black" onClick={
                                null
                            } >  </IconButton>
                                <IconButton
                                    className="text-black"
                                    onClick={() => window.location = `/distribution/msdad/supplementary-order/${this
                                        .state
                                        ?.data[tableMeta.rowIndex]
                                        ?.id
                                        }
                            `}>
                                    <Icon color="primary">visibility</Icon>
                                </IconButton>
                            </>
                            )
                        }
                    }
                }
            ],
        }
        this.handleChange = this.handleChange.bind(this);
        this.showDispatchSuccess = this.showDispatchSuccess.bind(this);
        this.showDispatchError = this.showDispatchError.bind(this);
    }

    componentDidMount() {
        this.loadData();
        // this.loadWarehouses()
    }

    showDispatchSuccess() {
        this.setState({ alert: true, message: 'Dispatch Successful', severity: "success"});
        setTimeout(() => window.location.href = "/distribution/msdad/dispatch-orders", 1000);
    }

    showDispatchError() {
        this.setState({ alert: true, message: 'Dispatch UnSuccessful', severity: "error"});
        setTimeout(() => window.location.href = "/distribution/msdad/dispatch-orders", 1000);
    }

    async setPage(page) {
        //Change paginations
        let formData = this.state.formData
        formData.page = page
        this.setState({
            formData
        }, () => {
            console.log("New formdata", this.state.formData)
            this.loadData()
        })
    }

    async getPharmacyDetails(search){

        let params ={
            limit:500,
            page:0,
            issuance_type:['Hospital','RMSD Main'],
            search:search 
        }

        let res = await ClinicService.fetchAllClinicsNew(params, null);

        if (res.status == 200) {
            console.log('phar', res)

            this.setState({
                pharmacy_list:res.data.view.data
            })
        }
    }

    async loadData() {
        this.setState({ loaded: false })
        let owner_id = await localStorageService.getItem('owner_id')
        let formData = this.state.formData
        formData.to_owner_id = owner_id

        this.setState({
            formData
        })
        // formData.distribution_officer_id = distribution_ID.id
        let orders = await ChiefPharmacistServices.getAllOrders(formData)
        if (orders.status == 200) {
            console.log('Orders', orders.data.view.data)
            this.setState(
                { data: orders.data.view.data, totalItems: orders.data.view.totalItems }
            )
        }
        // let cards = await ChiefPharmacistServices.getCards()
        // if (cards.status == 200) {
        // console.log('cards', cards.data.view.data)
        // this.setState(
        //     {cards: cards.data.view.data}
        //     )
        // }

        // if (this.state.sorted_Cards.length == 0){
        //     this.array_sort()
        // }

        this.setState({ loaded: true })
        let data = {
            type: "MSD"
        }
        let warehouses = await WarehouseServices.getWarehoure(data)
        if (warehouses.status == 200) {
            console.log('Warehouses', warehouses.data.view.data)
            this.setState(
                { all_pharmacy: warehouses.data.view.data, all_drug_stores: warehouses.data.view.data }
            )
        }
    }

    handleChange(e) {
        const {value, checked} = e.target;
        let updatedSelectedItems = [... this.state.selected_id];

        if( checked){
            updatedSelectedItems.push(value);
        }else{
            updatedSelectedItems = updatedSelectedItems.filter(item=> item!==value);
        }
        this.setState({selected_id: updatedSelectedItems});
    }

    display(){
        alert(this.state.selected_id.join(','));
        console.log(this.state.selected_id)
    }

    render() {
        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        <CardTitle title=" Dispatch Order" />
                        <main>
                            <div className='w-full'>
                                {this.state.Loaded ? (
                                    <Fragment>
                                        <div className='w-full'>
                                            <ValidatorForm onSubmit={() => this.loadData()} onError={() => null}>
                                            <Grid container="container" spacing={2} className='mt-10'>
                                            {/* <Grid item="item" className="px-2" lg={4} md={4} sm={12} xs={12}>
                                                <SubTitle title="Status"/>
                                                <Autocomplete
                                                        disableClearable className="w-full" options={this.state.all_status} onChange={(e, value) => {
                                                        if (value != null) {
                                                            let formData = this.state.formData
                                                            formData.status = value
                                                                .name
                                                                this
                                                                .setState({formData})
                                                        }
                                                        else if(value == null){
                                                            let formData = this.state.formData
                                                            formData.status = null
                                                                this.setState({formData})
                                                        }
                                                    }}
                                                    /*  defaultValue={this.state.all_district.find(
                                                    (v) => v.id == this.state.formData.district_id
                                                    )} 
                                                    value={this
                                                        .state
                                                        .all_status
                                                        .find((v) => v.id == this.state.formData.status)} getOptionLabel={(
                                                        option) => option.name
                                                        ? option.name
                                                        : ''} renderInput={(params) => (
                                                        <TextValidator {...params} placeholder="Status"
                                                            //variant="outlined"
                                                            fullWidth="fullWidth" variant="outlined" size="small"/>
                                                    )}/>
                                            </Grid> */}
                                            <Grid item="item" className="px-2" lg={4} md={4} sm={12} xs={12}>
                                            <SubTitle title="MSD Warehouse"/>
                                                <Autocomplete
                                                        disableClearable className="w-full" 
                                                        options={this.state.all_drug_stores} 
                                                        onChange={(e, value) => {
                                                        if (value != null) {
                                                            let formData = this.state.formData
                                                            // formData.drug_store = value
                                                            formData.to = value
                                                                .id
                                                                this
                                                                .setState({formData})
                                                        }
                                                    }}
                                                    /*  defaultValue={this.state.all_district.find(
                                                    (v) => v.id == this.state.formData.district_id
                                                    )} */
                                                    value={this
                                                        .state
                                                        .all_drug_stores
                                                        .find((v) => v.id == this.state.formData.to)} getOptionLabel={(
                                                        option) => option.name
                                                        ? option.name
                                                        : ''} renderInput={(params) => (
                                                            <TextValidator {...params} placeholder="MSD Warehouse"
                                                            //variant="outlined"
                                                            fullWidth="fullWidth" variant="outlined" size="small"/>
                                                    )}/>
                                            </Grid>
                                            <Grid item="item" className="px-2" lg={4} md={4} sm={12} xs={12}>
                                            <SubTitle title="Institiute"/>
                                                <Autocomplete
                                                        disableClearable className="w-full" 
                                                        options={this.state.pharmacy_list}
                                                        onChange={(e, value) => {
                                                        if (value != null) {
                                                            let formData = this.state.formData
                                                            formData.from_owner_id = value
                                                            // formData.pharmacy = value
                                                                .owner_id
                                                                this
                                                                .setState({formData})
                                                        }
                                                        else if(value == null){
                                                            let formData = this.state.formData
                                                            formData.from_owner_id = null
                                                                this.setState({formData})
                                                        }
                                                    }}
                                                    /*  defaultValue={this.state.all_district.find(
                                                    (v) => v.id == this.state.formData.district_id
                                                    )} */
                                                    value={this
                                                        .state
                                                        .all_pharmacy
                                                        .find((v) => v.owner_id == this.state.formData.from_owner_id)} 
                                                    
                                                    getOptionLabel={(
                                                        option) => option.name
                                                        ? option.name
                                                        : ''} renderInput={(params) => (
                                                            <TextValidator {...params} 
                                                            placeholder="Institiute"
                                                            //variant="outlined"
                                                            fullWidth="fullWidth" 
                                                            variant="outlined" 
                                                            size="small"
                                                            onChange={(e) => {
                                                                if (e.target.value.length > 3) {
                                                                this.getPharmacyDetails(e.target.value);
                                                                }
                                                            }}
                                                            />
                                                    )}/>
                                            </Grid>
                                            <Grid item lg={4} md={4} sm={4} xs={4} className="px-2">
                                            <SubTitle title={"Date Range"}></SubTitle>
                                            <Autocomplete
                                                        disableClearable
                                                className="w-full"
                                                options={[{ label: "Requested Date", value: "REQUESTED DATE" }, { label: "Required Date", value: "REQUIRED DATE" }, { label: "Allocated Date", value: "ALLOCATED DATE" }, { label: "Issued Date", value: "ISSUED DATE" }, { label: "Received Date", value: "RECEIVED DATE" }]}
                                                /*  defaultValue={dummy.find(
                                                     (v) => v.value == ''
                                                 )} */
                                                getOptionLabel={(option) => option.label}
                                                getOptionSelected={(option, value) =>
                                                    console.log("ok")
                                                }
                
                                                onChange={(event, value) => {
                                                    let formData = this.state.formData
                                                    if (value != null) {
                                                        formData.date_type = value.value
                                                        this.setState({date_selection: false })
                                                    } else {
                                                        formData.date_type = null
                                                        formData.to_date = null
                                                        formData.from_date = null
                                                        this.setState({date_selection: true })
                                                    }
                                                    this.setState({ formData})
                                                }}
                
                                                renderInput={(params) => (
                                                    <TextValidator
                                                        {...params}
                                                        placeholder="Date Range"
                                                        //variant="outlined"
                                                        //value={}
                                                        fullWidth
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        variant="outlined"
                                                        size="small"
                                                        // validators={[
                                                        //     'required',
                                                        // ]}
                                                        // errorMessages={[
                                                        //     'this field is required',
                                                        // ]}
                                                    />
                                                )}
                                            />
                                            {/* {
                                                this.state.filterDataValidation.date_type ?
                                                    ("") :
                                                    (<span style={{ color: 'red' }}>this field is required</span>)
                                            } */}
                
                                        </Grid>
                
                                            <Grid item="item" lg={4} md={4} sm={12} xs={12}>
                                                <SubTitle title="From"/>
                                                <LoonsDatePicker className="w-full" value={this.state.formData.from_date} placeholder="From"
                                                    // minDate={new Date()}
                                                    //maxDate={new Date()}
                                                    // required={!this.state.date_selection}
                                                    disabled={this.state.date_selection}
                                                    // errorMessages="this field is required"
                                                    onChange={(date) => {
                                                        let formData = this.state.formData
                                                        formData.from_date = dateParse(date)
                                                        this.setState({formData})
                                                    }}/>
                                            </Grid>
                                            <Grid item="item" lg={4} md={4} sm={12} xs={12}>
                                                <SubTitle title="To"/>
                                                <LoonsDatePicker className="w-full" value={this.state.formData.to_date} placeholder="To"
                                                   minDate={this.state.formData.from_date}
                                                    //maxDate={new Date()}
                                                    // required={!this.state.date_selection}
                                                    disabled={this.state.date_selection}
                                                    // errorMessages="this field is required"
                                                    onChange={(date) => {
                                                        let formData = this.state.formData
                                                        formData.to_date = dateParse(date)
                                                        this.setState({formData})
                                                    }}/>
                                            </Grid>
                                            <Grid item="item" className="px-2" lg={4} md={4} sm={12} xs={12}>
                                            <SubTitle title="Order ID"/>
                                                
                                                <TextValidator placeholder="Order ID"
                                                //variant="outlined"
                                                fullWidth="fullWidth" 
                                                variant="outlined" 
                                                size="small"
                                                onChange={(e) => {
                                                    let formData = this.state.formData
                                                    formData.order_id = e.target.value
                                                    this.setState({formData})
                                                }}
                                                />
                                              
                                            </Grid>
                                            <Grid
                                                item="item"
                                                lg={12}
                                                md={12}
                                                sm={12}
                                                xs={12}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'flex-end'
                                                }}>
                                                <LoonsButton type="submit"
                                                    //onClick={this.handleChange}
                                                >
                                                    <span className="capitalize">Filter</span>
                                                </LoonsButton>
                                            </Grid>
                                            <Grid item="item" lg={12} md={12} xs={12}></Grid>
                                            <Grid
                                                item="item"
                                                lg={4}
                                                md={4}
                                                sm={4}
                                                xs={4}
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    marginTop: '-20px'
                            
                                                }}>
                                                <SubTitle title="Search"/>
                
                                                <TextValidator className='w-full' placeholder="Search"
                                                    //variant="outlined"
                                                    
                                                    // fullWidth="fullWidth" 
                                                    variant="outlined" size="small"
                                                    // value={this.state.formData.search}
                                                    onChange={(e, value) => {
                                                        let formData = this.state.formData
                                                        if (e.target.value != '') {
                                                            formData.search = e.target.value;
                                                        }else{
                                                            formData.search = null
                                                        }                     
                                                        this.setState({formData})
                                                        console.log("form dat", this.state.formData)
                                                    }}
                
                                                    onKeyPress={(e) => {
                                                        if (e.key == "Enter") {                                            
                                                                this.loadData()            
                                                        }
                            
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
                                                    }}/>
                                            </Grid>
                                            {/* <Grid item="item" lg={1} md={1} sm={1} xs={1} className="text-right px-2">
                                                <LoonsButton className="text-left px-2 mt-6" progress={false} scrollToTop={false}
                                                    // type='submit'
                                                    startIcon="search"
                                                    // onClick={() => { this.handleSearchButton() }}
                                                >
                                                    <span className="capitalize">Search</span>
                                                </LoonsButton>
                                            </Grid> */}
                                        </Grid>
                                            </ValidatorForm>
                                            <Grid container="container" className="mt-2 pb-5">
                                                <Grid item="item" lg={12} md={12} sm={12} xs={12}>
                                                    {
                                                        this.state.loaded
                                                            ? <LoonsTable
                                                                //title={"All Aptitute Tests"}
                                                                id={'all_items'} data={this.state.data} columns={this.state.columns} 
                                                                options={{
                                                                    pagination: true,
                                                                    serverSide: true,
                                                                    count: this.state.totalItems,
                                                                    rowsPerPage: this.state.formData.limit,
                                                                    page: this.state.formData.page,
                                                                    print: true,
                                                                    viewColumns: true,
                                                                    download: true,
                                                                    onTableChange: (action, tableState) => {
                                                                        console.log(action, tableState)
                                                                        switch (action) {
                                                                            case 'changePage':
                                                                                this.setPage(tableState.page)
                                                                                break
                                                                            case 'sort':
                                                                                // this.sort(tableState.page, tableState.sortOrder);
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
                                        </div>
                                    </Fragment>
                                ) : (
                                    //load loading effect
                                    <Grid className="justify-center text-center w-full pt-12">
                                        <CircularProgress
                                            size={30}
                                        />
                                    </Grid>
                                )}
                            </div>

                        </main>
                        <Grid
                            item="item"
                            lg={12}
                            md={12}
                            sm={12}
                            xs={12}
                            style={{
                                display: 'flex',
                                alignItems: 'flex-end'
                            }}>
                            <LoonsButton type="submit" disabled={!this.state.selected_id.length}
                                onClick={()=> this.setState({dispatch:true})}
                            >
                                <span className="capitalize">Dispatch</span>
                            </LoonsButton>
                        </Grid>
                    </LoonsCard>
                    {/* <Dialog fullWidth maxWidth="sm" open={this.state.dialog_for_select_warehouse} >

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
                                    options={this.state.all_warehouse_loaded}
                                    onChange={(e, value) => {
                                        if (value != null) {                                       
                                            localStorageService.setItem('Selected_Warehouse', value);    
                                            this.setState({dialog_for_select_warehouse:false, Loaded:true})                                    
                                        }
                                    }}
                                    value={{
                                        name: this.state.selected_warehouse ? (this.state.all_warehouse_loaded.filter((obj) => obj.id == this.state.selected_warehouse).name) : null,
                                        id: this.state.selected_warehouse
                                    }}
                                    getOptionLabel={(option) => option.name != null ? option.name+" - "+ option.main_or_personal : null}
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
                    </Dialog> */}
                    <DispatchModel setOpen={(res) => this.setState({ dispatch: res })} open={this.state.dispatch} selected_id={this.state.selected_id} showSuccess={this.showDispatchSuccess} showError={this.showDispatchError}/>
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
                </MainContainer>
            </Fragment>

        )
    }
}

export default withStyles(styleSheet)(DispatchOrders)