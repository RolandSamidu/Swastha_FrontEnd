import {
    CircularProgress,
    Divider,
    Grid,
    Icon,
    IconButton,
    InputAdornment,
    Typography
} from "@material-ui/core";
import TurnedInIcon from '@material-ui/icons/TurnedIn';
import {Autocomplete} from "@material-ui/lab";
import {LoonsTable, MainContainer, SubTitle} from "app/components/LoonsLabComponents";
import LoonsButton from "app/components/LoonsLabComponents/Button";

import LoonsDatePicker from "app/components/LoonsLabComponents/DatePicker";
import React, {Component, Fragment} from "react";
import {TextValidator, ValidatorForm} from "react-material-ui-form-validator";
import SearchIcon from '@material-ui/icons/Search';
import PharmacyCards from "app/views/ChiefPharmacist/tabs/tabs/components/PharmacyCards";
import ChiefPharmacistServices from "app/services/ChiefPharmacistServices";
import WarehouseServices from "app/services/WarehouseServices";
import localStorageService from "app/services/localStorageService";
import {dateParse, dateTimeParse} from "utils";
import ClinicService from "app/services/ClinicService";

class OrderBase_AllOrders extends Component {

    constructor(props) {
        super(props)
        this.state = {
            selected_warehouse:null,
            owner_id:null,
            dialog_for_select_warehouse: false,
            all_warehouse_loaded: [],
            owner_id:null,
            date_selection: true,
            cards: [],
            pharmacy_list:[],
            sorted_Cards: [],
            all_status: [
                {
                    id: 1,
                    name: 'ALLOCATED'
                }, {
                    id: 2,
                    name: 'APPROVED'
                }, {
                    id: 3,
                    name: 'COMPLETED'
                }, {
                    id: 4,
                    name: 'ISSUED'
                }, {
                    id: 5,
                    name: 'ORDERED'
                }, {
                    id: 6,
                    name: 'RECIEVED'
                }, {
                    id: 7,
                    name: 'REJECTED'
                }, {
                    id: 7,
                    name: 'Pending'
                },
            ],
            all_drug_stores: [],
            all_pharmacy: [],
            all_date_range: [],
            formData: {
                limit: 20,
                page: 0,
                //owner_id: null,
                'order[0]': [
                    'updatedAt', 'DESC'
                ],
                distribution_officer_id:null,
                pharmacy: null,
                to: null,
                from_date: null,
                to_date: null,
                status: ['ALLOCATED','APPROVED','APRROVED','COMPLETED','ISSUED','ORDERED','RECIEVED','ALL RECIEVED','REJECTED','Pending','ISSUE SUBMITTED','DISPATCHED'],
                date_type: null,
                type: this.props.type? this.props.type: null,
                from: null,
                search:null
            },
            data: [],
            columns: [
                {
                    name:'special_normal_type',
                    label: ' ',
                    options: {
                        display: true,
                        customBodyRender:(value, tableMeta, updateValue) =>{
                            //  console.log('my data', this.state.data[tableMeta.rowIndex].special_normal_type)
                            if (this.state.data[tableMeta.rowIndex]?.special_normal_type === 'SUPPLEMENTARY'){
                                return (
                                    <>
                                        {/* <IconButton className="text-primary"> */}
                                            < TurnedInIcon color="primary" />
                                        {/* </IconButton>    */}
                                    </>
                                )
                            }else{
                                return null
                            }
                        }
                    }
                },
                {
                    name: 'institute',
                    label: 'Institution',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            console.log('this.state.data', this.state.data)
                            return this.state.data[tableMeta.rowIndex]?.institute == undefined ? this.state.data[tableMeta.rowIndex]?.fromStore?.name : (this.state.data[tableMeta.rowIndex]?.institute + ' (' + this.state.data[tableMeta.rowIndex]?.Department?.name + ')')
                        }
                    }
                }, {
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
                ,{
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
                    name: 'approved_date',
                    label: 'Approved Date',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            if (this.state.data){
                            let data = this
                                .state
                                .data[dataIndex]
                                ?.approved_date;
                                if (data){
                                    return <p>{dateTimeParse(data)}</p>
                                }else {
                                    return "N/A"
                                }
                            }else {
                                    return "N/A"
                            }

                        }
                    }
                }, {
                    name: 'createdAt',
                    label: 'Request Date',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                           if (this.state.data){
                                let data = this
                                    .state
                                    .data[dataIndex]
                                    ?.createdAt;
                                    if (data){
                                        return <p>{dateTimeParse(data)}</p>
                                    }else {
                                        return "N/A"
                                    }
                                }else {
                                        return "N/A"
                                }

                        }
                    }
                }, {
                    name: 'required_date',
                    label: 'Required Date',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            if (this.state.data){
                                let data = this
                                    .state
                                    .data[dataIndex]
                                    ?.required_date;
                                    if (data){
                                        return <p>{dateTimeParse(data)}</p>
                                    }else {
                                        return "N/A"
                                    }
                                }else {
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
                    name: 'time_slot',
                    label: 'Time Slot',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            if (this.state.data){
                            let from = ''
                            let to = ''

                            if (this.state.data[dataIndex]?.Delivery == null) {
                                console.log("null Delivery");
                            } else {
                                if (this.state.data[dataIndex]?.Delivery?.time_from != null) {
                                    from = this
                                        .state
                                        .data[dataIndex]
                                        ?.Delivery
                                        ?.time_from
                                }

                                if (this.state.data[dataIndex]?.Delivery?.time_to != null) {
                                    to = this
                                        .state
                                        .data[dataIndex]
                                        ?.Delivery
                                        ?.time_to
                                }

                            }
                            let slot = from + "-" + to
                            return slot
                        }else{
                            return "N/A"
                        }
                    }
                        

                    }
                }, {
                    name: 'my_remarks',
                    label: 'My Remarks',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {                            
                            if (this.state.data){
                                let remarks = []
                                console.log("Delivery", this.state.data[dataIndex]?.Delivery);
                                if (this.state.data[dataIndex]?.Delivery != null || this.state.data[dataIndex]?.Delivery != undefined) {
                                    console.log("Delivery2", this.state.data[dataIndex]?.Delivery);
                                    this.state.data[dataIndex].Delivery.Remarks.map((remark) => { 
                                            if (remark != null){
                                                if (remark.Remarks != null){
                                                    remarks.push(remark.Remarks.remark+"\n")
                                                }else{
                                                    remarks.push(remark.other_remarks+"\n")
                                                }                                            
                                            }                                
                                            
                                        })
                                    console.log('array', remarks);
                                    return remarks
                                } else {
                                    return 'No Remarks'
                                }
    
                            }else{
                                return "N/A"
                            }
                    }
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
                },{
                    name: 'status',
                    label: 'Status',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            if(this.state.data[dataIndex]?.status=='APRROVED'||this.state.data[dataIndex]?.status=='APPROVED'){
                                return "Pending"
                            }else{
                                return this.state.data[dataIndex]?.status
                            }
                        }
                    }
                }, {
                    name: 'approval_status',
                    label: 'Supplementary Status',
                    options: {
                        display: true,
                    }
                }, 
                {
                    name: 'action',
                    label: 'Action',
                    options: {
                        // filter: true,
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (<> < IconButton className = "text-black" onClick = {
                                null
                            } >  </IconButton>
                                    <IconButton
                                        className="text-black"
                                        onClick={() => window.location = `/distribution/order/${this
                                    .state
                                    .data[tableMeta.rowIndex]
                                    ?.id
                            }/${
                                this
                                    .state
                                    .data[tableMeta.rowIndex]
                                    ?.number_of_items
                            }/${
                                this
                                    .state
                                    .data[tableMeta.rowIndex]
                                    ?.order_id
                            }/${
                                this
                                    .state
                                    .data[tableMeta.rowIndex]
                                    ?.Employee
                                    ?.name
                            }/${
                                this
                                    .state
                                    .data[tableMeta.rowIndex]
                                    ?.status
                            }/${
                                this
                                    .state
                                    .data[tableMeta.rowIndex]
                                    ?.type
                            }
                            `}>
                                        <Icon color="primary">visibility</Icon>
                                    </IconButton>
                                </>
                                    )}
                        }
                    }
                ],
                totalItems: null,
                loaded: false,
            }
        }

        componentDidMount() {
            this.loadWarehouses()
            this.loadData()
            // this.array_sort()
        }

        async loadWarehouses() {
            this.setState({loaded: false})
            var user = await localStorageService.getItem('userInfo');
            console.log('user', user)
            var id = user.id;
            var all_pharmacy_dummy = [];
            var selected_warehouse_cache = await localStorageService.getItem('Selected_Warehouse');
            if (!selected_warehouse_cache) {
                
            } 
            else {  
                //this.state.formData.owner_id = selected_warehouse_cache.owner_id
                this.state.formData.to = selected_warehouse_cache.id
                this.setState({ owner_id: selected_warehouse_cache.owner_id,selected_warehouse:selected_warehouse_cache.id ,dialog_for_select_warehouse:false})
                console.log(this.state.selected_warehouse)
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
                            main_or_personal:element.Warehouse.main_or_personal,
                            owner_id:element.Warehouse.owner_id,
                            id: element.warehouse_id,
                            pharmacy_drugs_stores_id: element.Warehouse.pharmacy_drugs_store_id,
                        }
    
                    )
                });
                console.log("warehouse", all_pharmacy_dummy)
                this.setState({ all_warehouse_loaded: all_pharmacy_dummy , loaded:true})
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
                this.loadData()
            })
        }

        async loadData() {
            this.setState({loaded: false})
            let coverUpEmp=await localStorageService.getItem('coverUpInfo');
            let distribution_ID=await localStorageService.getItem("userInfo")
            console.log("Distribution Officer",distribution_ID)
            let formData = this.state.formData
            
            if(coverUpEmp){
                formData.distribution_officer_id= coverUpEmp.id
            }else{
                formData.distribution_officer_id = distribution_ID.id
            }

            let orders = await ChiefPharmacistServices.getAllOrders(formData)
            if (orders.status == 200) {
                console.log('Orders', orders.data.view.data)
                // let from_owner_id = orders.data.view.data.map((el) => el.from_owner_id)

                let itemslist = orders.data.view.data.map((dataset) => dataset.from_owner_id)
                let uniquitemslist = [...new Set(itemslist)]

                    this.getPharmacyDet(uniquitemslist, orders.data.view.data)

                    this.setState(
                        { totalItems: orders.data.view.totalItems }
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
            
            this.setState({loaded: true})
           let data={
                type:"MSD"
            }
            let warehouses = await WarehouseServices.getWarehoure(data)
            if (warehouses.status == 200) {
                console.log('Warehouses', warehouses.data.view.data)
                this.setState(
                    {all_pharmacy: warehouses.data.view.data, all_drug_stores: warehouses.data.view.data}
                )
            }    
            
        }


         // get institution details
    async getPharmacyDet(formOwnID, mainData) {

        let params = { 
            issuance_type: ["Hospital", "RMSD Main"], 
            // limit: 1, 
            // page: 0,
            'order[0]': ['createdAt', 'ASC'],
            selected_owner_id: formOwnID
        };
    
        let res = await ClinicService.fetchAllClinicsNew(params, null);


        let updatedArray = []
        if (res.status == 200) {
            updatedArray = mainData.map((obj1) => {
                const obj2 = res.data.view.data.find((obj) => obj.owner_id === obj1.from_owner_id);

                obj1.institute = obj2?.name
                obj1.Department = obj2?.Department

                 return obj1;
            });

        }

        this.setState(
            {
                data: updatedArray,
            },
            () => {
                this.render()
            }
        )
        
    }


        async getPharmacyDetails(search){

            let params ={
                limit:500,
                page:0,
                issuance_type:['Hospital','RMSD Main'],
                search:search 
            }

            let res = await ClinicService.fetchAllClinicsNew(params, null);

            if (res.status == 200) {
                console.log('phar', res)

                this.setState({
                    pharmacy_list:res.data.view.data
                })
            }
        }

        // array_sort() {

        //     let testArray = this
        //         .state
        //         .cards
        //         .filter(
        //             (value, index, self) => index === self.findIndex((t) => (t.from === value.from))
        //         )
    
        //     testArray.filter((value, index, self) => {
        //         let localArray = []
        //         this
        //             .state
        //             .cards
        //             .map(card => {
        //                 if (card.from == value.from) {
        //                     localArray.push({'status': card.status, 'total': card.total_count})
        //                 }
        //             })
    
        //         this
        //             .state
        //             .sorted_Cards
        //             .push({'name': value.name, id: value.from, 'statuses': localArray})
    
        //     })
        // }

        render() {

            return (
                <MainContainer>
                    <Grid container="container" spacing={2}>
                        <Grid item="item" xs={12}>
                            <Typography variant="h5" className="font-semibold">ALL ORDERS</Typography>
                            <Divider/>
                        </Grid>
                    </Grid>
                    {/* {this.state.loaded ?
                <div
                style={{
                    overflowX: 'scroll',
                    display: 'inline-flex',
                    flexWrap: 'nowrap',
                    width: '80vw'
                }}>
                {
                    this
                        .state
                        .sorted_Cards
                        .map((value, index) => (
                            <div>
                                {value.statuses.length !=0 ? <PharmacyCards data={value}/> : null}
                            </div>
                        ))
                }
            </div> : 'No card data'
                } */}
                    <ValidatorForm onSubmit={() => this.loadData()} onError={() => null}>
                        <Grid container="container" spacing={2} className='mt-10'>
                            <Grid item="item" className="px-2" lg={4} md={4} sm={12} xs={12}>
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
                                    )} */
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
                            </Grid>
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
                            <SubTitle title="Other Store"/>
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
                                            placeholder="Other Store"
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
                                    required={!this.state.date_selection}
                                    disabled={this.state.date_selection}
                                    errorMessages="this field is required"
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
                                    required={!this.state.date_selection}
                                    disabled={this.state.date_selection}
                                    errorMessages="this field is required"
                                    onChange={(date) => {
                                        let formData = this.state.formData
                                        formData.to_date = dateParse(date)
                                        this.setState({formData})
                                    }}/>
                            </Grid>
                            <Grid item="item" lg={4} md={4} sm={12} xs={12}>
                            <SubTitle title="Vehicle Number" />
                            <TextValidator
                                className='w-full'
                                placeholder="Exp- LP-3428"
                                //variant="outlined"
                                // fullWidth="fullWidth" 
                                variant="outlined"
                                size="small"
                                value={this.state.formData.vehicle_no}
                                onChange={(e, value) => {

                                    let formData = this.state.formData
                                    if (e.target.value) {

                                        // let formDataValidation = this.state.formDataValidation;
                                        // formDataValidation.vehicle_no = true;

                                        formData.vehicle_no = e.target.value;

                                        this.setState({ formData })

                                    } else {
                                        formData.vehicle_no = null
                                    }

                                    this.setState({ formData })

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
                                            {/* <SearchIcon></SearchIcon> */}
                                        </InputAdornment>
                                    )
                                }} />

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

                                <TextValidator className='w-full' placeholder="Order ID"
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
                                            id={'all_items'} data={this.state.data} columns={this.state.columns} options={{
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
                                            <CircularProgress size={30}/>
                                        </Grid>
                                    )
                            }

                        </Grid>
                    </Grid>
                </MainContainer>
            )
        }
    }

    export default OrderBase_AllOrders