import {
    CircularProgress,
    Divider,
    Grid,
    Icon,
    IconButton,
    InputAdornment,
    Typography
} from "@material-ui/core";
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
import {dateTimeParse} from "utils";

class OrderBase_ToBeApproved extends Component {

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
                }
            ],
            all_drug_stores: [],
            all_pharmacy: [],
            all_date_range: [],
            formData: {
                distribution_officer_id:null,
                limit: 20,
                page: 0,
                owner_id: null,
                'order[0]': [
                    'updatedAt', 'DESC'
                ],
                pharmacy: null,
                // to: ['600329c7-f99f-4f04-9f7c-240090526aee'],
                from_date: null,
                to_date: null,
                status: ['ISSUE SUBMITTED'],
                date_type: null,
                from: null,
                search:null
            },
            data: [
                // {     pharmacy: '27653',     order_id: '134',     counter_pharmacist_id:
                // '743',     pharmacist_name: 'jdgah',     total_items: '15', allocated_items:
                // '15',     dropped_items: '15',     approved_date: '74185', request_date:
                // '263465',     required_date: '13654',     delivery_date: '', time_slot: '',
                // my_remarks: '',     status: 'Pending' }
            ],
            columns: [
                {
                    name: 'pharmacy',
                    label: 'Pharmacy',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (this.state.data[tableMeta.rowIndex].fromStore.name)
                        }
                    }
                }, {
                    name: 'order_id',
                    label: 'Order ID',
                    options: {
                        display: true
                    }
                }, {
                    name: 'pharmacist_name',
                    label: 'Counter Pharmacist',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (this.state.data[tableMeta.rowIndex].Employee.name)
                        }
                    }
                }, {
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
                            let data = this
                                .state
                                .data[dataIndex]
                                .approved_date;
                                if (data){
                                    return <p>{dateTimeParse(data)}</p>
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
                            let data = this
                                .state
                                .data[dataIndex]
                                .createdAt;
                            return <p>{dateTimeParse(data)}</p>

                        }
                    }
                }, {
                    name: 'required_date',
                    label: 'Required Date',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this
                                .state
                                .data[dataIndex]
                                .required_date;
                            return <p>{dateTimeParse(data)}</p>

                        }
                    }
                }, {
                    name: 'delivered_date',
                    label: 'Delivery Date',
                    options: {
                        display: true
                    }
                }, {
                    name: 'time_slot',
                    label: 'Time Slot',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let from = ''
                            let to = ''

                            if (this.state.data[dataIndex].Delivery == null) {
                                console.log("null Delivery");
                            } else {
                                if (this.state.data[dataIndex].Delivery.time_from != null) {
                                    from = this
                                        .state
                                        .data[dataIndex]
                                        .Delivery
                                        .time_from
                                }

                                if (this.state.data[dataIndex].Delivery.time_to != null) {
                                    to = this
                                        .state
                                        .data[dataIndex]
                                        .Delivery
                                        .time_to
                                }

                            }
                            let slot = from + "-" + to
                            return slot
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
                                console.log("Delivery", this.state.data[dataIndex].Delivery);
                                if (this.state.data[dataIndex].Delivery != null || this.state.data[dataIndex].Delivery != undefined) {
                                    console.log("Delivery2", this.state.data[dataIndex].Delivery);
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
                            return (<> < IconButton className = "text-black" onClick = {
                                null
                            } >   </IconButton>
                                    <IconButton
                                        className="text-black"
                                        onClick={() => window.location = `/distribution/order/${this
                                    .state
                                    .data[tableMeta.rowIndex]
                                    .id
                            }/${
                                this
                                    .state
                                    .data[tableMeta.rowIndex]
                                    .number_of_items
                            }/${
                                this
                                    .state
                                    .data[tableMeta.rowIndex]
                                    .order_id
                            }/${
                                this
                                    .state
                                    .data[tableMeta.rowIndex]
                                    .Employee
                                    .name
                            }/${
                                this
                                    .state
                                    .data[tableMeta.rowIndex]
                                    .status
                            }/${
                                this
                                    .state
                                    .data[tableMeta.rowIndex]
                                    .type
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
                this.state.formData.owner_id = selected_warehouse_cache.owner_id
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
            let distribution_ID=await localStorageService.getItem("userInfo")
            console.log("Distribution Officer",distribution_ID)
            let formData = this.state.formData
            formData.distribution_officer_id = distribution_ID.id

            let orders = await ChiefPharmacistServices.getAllOrders(formData)
            if (orders.status == 200) {
                console.log('Orders', orders.data.view.data)
                this.setState(
                    {data: orders.data.view.data, totalItems: orders.data.view.totalItems}
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

            let warehouses = await WarehouseServices.getWarehoure()
            if (warehouses.status == 200) {
                console.log('Warehouses', warehouses.data.view.data)
                this.setState(
                    {all_pharmacy: warehouses.data.view.data, all_drug_stores: warehouses.data.view.data}
                )
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
                            <Typography variant="h5" className="font-semibold">TO BE ISSUED</Typography>
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
                                        disableClearable className="w-full" options={this.state.all_drug_stores} onChange={(e, value) => {
                                        if (value != null) {
                                            let formData = this.state.formData
                                            formData.drug_store = value
                                                .id
                                                this
                                                .setState({formData})
                                        }
                                        else if(value == null){
                                            let formData = this.state.formData
                                            formData.drug_store = null
                                                this.setState({formData})
                                        }
                                    }}
                                    /*  defaultValue={this.state.all_district.find(
                                    (v) => v.id == this.state.formData.district_id
                                    )} */
                                    value={this
                                        .state
                                        .all_drug_stores
                                        .find((v) => v.id == this.state.formData.drug_store)} getOptionLabel={(
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
                                        disableClearable className="w-full" options={this.state.all_pharmacy} onChange={(e, value) => {
                                        if (value != null) {
                                            let formData = this.state.formData
                                            formData.pharmacy = value
                                                .id
                                                this
                                                .setState({formData})
                                        }
                                        else if(value == null){
                                            let formData = this.state.formData
                                            formData.pharmacy = null
                                                this.setState({formData})
                                        }
                                    }}
                                    /*  defaultValue={this.state.all_district.find(
                                    (v) => v.id == this.state.formData.district_id
                                    )} */
                                    value={this
                                        .state
                                        .all_pharmacy
                                        .find((v) => v.id == this.state.formData.pharmacy)} getOptionLabel={(
                                        option) => option.name
                                        ? option.name
                                        : ''} renderInput={(params) => (
                                            <TextValidator {...params} placeholder="Other Store"
                                            //variant="outlined"
                                            fullWidth="fullWidth" variant="outlined" size="small"/>
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
                                        formData.from_date = date
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
                                        formData.to_date = date
                                        this.setState({formData})
                                    }}/>
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

    export default OrderBase_ToBeApproved