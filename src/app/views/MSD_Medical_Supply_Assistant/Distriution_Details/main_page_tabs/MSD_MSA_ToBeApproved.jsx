import {
    CircularProgress,
    Divider,
    Grid,
    Icon,
    IconButton,
    InputAdornment,
    Typography
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { LoonsTable, MainContainer, SubTitle } from "app/components/LoonsLabComponents";
import LoonsButton from "app/components/LoonsLabComponents/Button";

import LoonsDatePicker from "app/components/LoonsLabComponents/DatePicker";
import React, { Component, Fragment } from "react";
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import SearchIcon from '@material-ui/icons/Search';
import PharmacyCards from "app/views/ChiefPharmacist/tabs/tabs/components/PharmacyCards";
import ChiefPharmacistServices from "app/services/ChiefPharmacistServices";
import WarehouseServices from "app/services/WarehouseServices";
import DivisionsServices from "app/services/DivisionsServices";
import localStorageService from "app/services/localStorageService";
import { dateTimeParse,dateParse } from "utils";

class MSD_MSA_ToBeApproved extends Component {

    constructor(props) {
        super(props)
        this.state = {
            selected_warehouse: null,
            owner_id: null,
            dialog_for_select_warehouse: false,
            all_warehouse_loaded: [],
            owner_id: null,
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
            drugStoreData: [],
            all_district: [],
            formData: {
                limit: 20,
                page: 0,
                owner_id: null,
                'order[0]': [
                    'updatedAt', 'DESC'
                ],
                type: 'RMSD Order',
                pharmacy: null,
                district_id: null,
                to: null,
                from_date: null,
                to_date: null,
                status: ['ORDERED','Pending','APPROVED'],
                date_type: null,
                from: null,
                search: null
            },
            data: [],
            columns: [
                {
                    name: 'pharmacy',
                    label: 'Pharmacy',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if (this.state.data) {
                                return (this.state.data[tableMeta.rowIndex].fromStore.name)
                            } else {
                                return "N/A"
                            }

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
                , {
                    name: 'number_of_items',
                    label: 'Number of Items',
                    options: {
                        display: true
                    }
                },/*  {
                    name: 'allocated_items',
                    label: 'Allocated Items',
                    options: {
                        display: true
                    }
                }, {
                    name: 'dropped_items',
                    label: 'Dropped Items',
                    options: {
                        display: true
                    }
                }, */ {
                    name: 'approved_date',
                    label: 'Approved Date',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            if (this.state.data) {
                                let data = this
                                    .state
                                    .data[dataIndex]
                                    .approved_date;
                                if (data) {
                                    return <p>{dateParse(data)}</p>
                                } else {
                                    return "N/A"
                                }
                            } else {
                                return "N/A"
                            }

                        }
                    }
                }, {
                    name: 'createdAt',
                    label: 'Request Date',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            if (this.state.data) {
                                let data = this
                                    .state
                                    .data[dataIndex]
                                    .createdAt;
                                if (data) {
                                    return <p>{dateParse(data)}</p>
                                } else {
                                    return "N/A"
                                }
                            } else {
                                return "N/A"
                            }

                        }
                    }
                }, {
                    name: 'required_date',
                    label: 'Required Date',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            if (this.state.data) {
                                let data = this
                                    .state
                                    .data[dataIndex]
                                    .required_date;
                                if (data) {
                                    return <p>{dateParse(data)}</p>
                                } else {
                                    return "N/A"
                                }
                            } else {
                                return "N/A"
                            }


                        }
                    }
                }, {
                    name: 'issue_date',
                    label: 'Issue Date',
                    options: {
                        display: true
                    }
                }, {
                    name: 'time_slot',
                    label: 'Time Slot',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            if (this.state.data) {
                                let from = ''
                                let to = ''

                                if (this.state.data[dataIndex]?.Delivery == null) {
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
                            } else {
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
                            if (this.state.data) {
                                let remarks = []
                                console.log("Delivery", this.state.data[dataIndex].Delivery);
                                if (this.state.data[dataIndex].Delivery != null || this.state.data[dataIndex].Delivery != undefined) {
                                    console.log("Delivery2", this.state.data[dataIndex].Delivery);
                                    this.state.data[dataIndex].Delivery.Remarks.map((remark) => {
                                        if (remark != null) {
                                            if (remark.Remarks != null) {
                                                remarks.push(remark.Remarks.remark + "\n")
                                            } else {
                                                remarks.push(remark.other_remarks + "\n")
                                            }
                                        }

                                    })
                                    console.log('array', remarks);
                                    return remarks
                                } else {
                                    return 'No Remarks'
                                }

                            } else {
                                return "N/A"
                            }
                        }
                    }

                }, {
                    name: 'delivery_mode',
                    label: 'Delivery Mode',
                    options: {
                        display: true
                    }
                }, {
                    name: 'status',
                    label: 'Status',
                    options: {
                        display: true
                    }
                }, 
                {
                    name : 'book_no',
                    label: 'Reference No',
                    options: {
                        display: true,
                        customBodyRender : (value, tableMeta, updateValue) => {
                            return (
                                <>
                                    <p>BK {this.state.data[tableMeta.rowIndex].book_no} / F {this.state.data[tableMeta.rowIndex].page_no}</p>
                                </>
                            )
                        }
                    }
                },
                {
                    name: 'action',
                    label: 'Action',
                    options: {
                        // filter: true,
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (<> < IconButton className="text-black" onClick={
                                null
                            } >   </IconButton>
                                <IconButton
                                    className="text-black"
                                    onClick={() => window.location = `/msa_all_order/all-orders/order/${this
                                        .state
                                        .data[tableMeta.rowIndex]
                                        .id
                                        }/${this
                                            .state
                                            .data[tableMeta.rowIndex]
                                            .number_of_items
                                        }/${this
                                            .state
                                            .data[tableMeta.rowIndex]
                                            .order_id
                                        }/${this
                                            .state
                                            .data[tableMeta.rowIndex]
                                            .Employee
                                            .name
                                        }/${this
                                            .state
                                            .data[tableMeta.rowIndex]
                                            .Employee
                                            .contact_no
                                        }/${this
                                            .state
                                            .data[tableMeta.rowIndex]
                                            .status
                                        }/${this
                                            .state
                                            .data[tableMeta.rowIndex]
                                            .type
                                        }?institute=${this.state.data[tableMeta.rowIndex]?.institute}
                            `}>
                                    <Icon color="primary">visibility</Icon>
                                </IconButton>
                            </>
                            )
                        }
                    }
                }
            ],
            totalItems: null,
            loaded: false,
        }
    }

    async loadDrugStoreData(search) {
        //Fetch department data

        //let res = await PharmacyService.fetchAllDataStorePharmacy('001', {})

        let owner_id = await localStorageService.getItem('owner_id')
        let userInfo = await localStorageService.getItem('userInfo')

        if (userInfo.roles.includes('RMSD MSA') || userInfo.roles.includes('RMSD Distribution Officer')) {
            owner_id = null
        }

        let res = await WarehouseServices.getAllWarehousewithOwner({ store_type: 'pharmacy',search:search }, owner_id)

        console.log("warehouses", res)
        if (200 == res.status) {
            this.setState({
                drugStoreData: res.data.view.data,
            })
            console.log("this.state.drugStoreData", this.state.drugStoreData);
        }
    }

    async loadDistrict() {
        let district_res = await DivisionsServices.getAllDistrict({
            limit: 99999,
        })
        if (district_res.status == 200) {
            console.log('district', district_res.data.view.data)
            this.setState({
                all_district: district_res.data.view.data,
            })
        }
    }

    componentDidMount() {
        this.loadWarehouses()
        this.loadData()
       // this.loadDrugStoreData()
        this.loadDistrict()
        // this.array_sort()
    }

    async loadWarehouses() {
        this.setState({ loaded: false })
        var user = await localStorageService.getItem('userInfo');
        console.log('user', user)
        var id = user.id;
        var all_pharmacy_dummy = [];
        var selected_warehouse_cache = await localStorageService.getItem('Selected_Warehouse');
        if (!selected_warehouse_cache) {

        }
        else {
            // this.state.formData.owner_id = selected_warehouse_cache.owner_id
            this.state.formData.to = selected_warehouse_cache.id
            this.setState({ owner_id: selected_warehouse_cache.owner_id, selected_warehouse: selected_warehouse_cache.id, dialog_for_select_warehouse: false })
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
                        main_or_personal: element.Warehouse.main_or_personal,
                        owner_id: element.Warehouse.owner_id,
                        id: element.warehouse_id,
                        pharmacy_drugs_stores_id: element.Warehouse.pharmacy_drugs_store_id,
                    }

                )
            });
            console.log("warehouse", all_pharmacy_dummy)
            this.setState({ all_warehouse_loaded: all_pharmacy_dummy, loaded: true })
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
        this.setState({ loaded: false })
        let orders = await ChiefPharmacistServices.getAllOrders(this.state.formData)
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

        let warehouses = await WarehouseServices.getWarehoure()
        if (warehouses.status == 200) {
            console.log('Warehouses', warehouses.data.view.data)
            this.setState(
                { all_pharmacy: warehouses.data.view.data, all_drug_stores: warehouses.data.view.data }
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
                        <Typography variant="h5" className="font-semibold">Orders To Be Approved</Typography>
                        <Divider />
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
                            <SubTitle title="Status" />
                            <Autocomplete
                                        disableClearable className="w-full" options={this.state.all_status} onChange={(e, value) => {
                                if (value != null) {
                                    let formData = this.state.formData
                                    formData.status = value
                                        .id
                                    this
                                        .setState({ formData })
                                }
                            }}
                              
                                value={this
                                    .state
                                    .all_status
                                    .find((v) => v.id == this.state.formData.status)} getOptionLabel={(
                                        option) => option.name
                                            ? option.name
                                            : ''} renderInput={(params) => (
                                                <TextValidator {...params} placeholder="Status"
                                                    //variant="outlined"
                                                    fullWidth="fullWidth" variant="outlined" size="small" />
                                            )} />
                        </Grid> */}
                        <Grid item="item" className="px-2" lg={4} md={4} sm={12} xs={12}>
                            <SubTitle title="District" />
                            <Autocomplete
                                        disableClearable
                                                    className="w-full"
                                                    options={
                                                        this.state
                                                            .all_district
                                                    }
                                                    onChange={(
                                                        e,
                                                        value
                                                    ) => {
                                                        if (value != null) {
                                                            let formData =
                                                                this.state
                                                                    .formData
                                                            formData.district_id =
                                                                value.id
                                                            this.setState({
                                                                formData,
                                                            })
                                                        }
                                                    }}
                                                    /*  defaultValue={this.state.all_district.find(
                                                         (v) => v.id == this.state.formData.district_id
                                                     )} */


                                                    value={{
                                                        name: this.state.formData.district_id ? (this.state.all_district.find((obj) => obj.id == this.state.formData.district_id).name) : null,
                                                        id: this.state.formData.district_id
                                                    }}

                                                    getOptionLabel={(
                                                        option
                                                    ) =>
                                                        option.name
                                                            ? option.name
                                                            : ''
                                                    }
                                                    renderInput={(
                                                        params
                                                    ) => (
                                                        <TextValidator
                                                            {...params}
                                                            placeholder="District"
                                                            //variant="outlined"
                                                            fullWidth
                                                            variant="outlined"
                                                            size="small"
                                                        />
                                                    )}
                                                />
                        </Grid>

                        <Grid item="item" className="px-2" lg={4} md={4} sm={12} xs={12}>
                            <SubTitle title="Warehouse Type" />
                            <Autocomplete
                                        disableClearable className="w-full" options={["Line Ministry Hospitals", "RMSD"]} onChange={(e, value) => {
                                if (value != null) {
                                    let formData = this.state.formData
                                    formData.warehouse_type = value
                                        .id
                                    this
                                        .setState({ formData })
                                }
                            }}
                                /*  defaultValue={this.state.all_district.find(
                                (v) => v.id == this.state.formData.district_id
                                )} */
                                // value={this
                                //     .state
                                //     .all_pharmacy
                                //     .find((v) => v.id == this.state.formData.pharmacy)} getOptionLabel={(
                                //     option) => option.name
                                //     ? option.name
                                //     : ''} 
                                renderInput={(params) => (
                                    <TextValidator {...params} placeholder="Warehouse Type"
                                        //variant="outlined"
                                        fullWidth="fullWidth" variant="outlined" size="small" />
                                )} />
                        </Grid>

                        <Grid item="item" className="px-2" lg={4} md={4} sm={12} xs={12}>
                            <SubTitle title="Pharmacy" />
                            <Autocomplete
                                        disableClearable className="w-full" options={this.state.drugStoreData} onChange={(e, value) => {
                                if (value != null) {
                                    let formData = this.state.formData
                                    formData.from = value.id
                                    this
                                        .setState({ formData })
                                }
                            }}
                                /*  defaultValue={this.state.all_district.find(
                                (v) => v.id == this.state.formData.district_id
                                )} */
                                value={this.state.drugStoreData.find((v) => v.id == this.state.formData.from)}
                                getOptionLabel={(option) => option.name? option.name: ''}
                                renderInput={(params) => (
                                    <TextValidator {...params} placeholder="Pharmacy"
                                        //variant="outlined"
                                        onChange={(e)=>{
                                            if(e.target.value.length>2){
                                                this.loadDrugStoreData(e.target.value)
                                            }
                                        }}
                                        fullWidth="fullWidth" variant="outlined" size="small" />
                                )} />
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
                                        this.setState({ date_selection: false })
                                    } else {
                                        formData.date_type = null
                                        formData.to_date = null
                                        formData.from_date = null
                                        this.setState({ date_selection: true })
                                    }
                                    this.setState({ formData })
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
                            <SubTitle title="From" />
                            <LoonsDatePicker className="w-full" value={this.state.formData.from_date} placeholder="From"
                                // minDate={new Date()}
                                //maxDate={new Date()}
                                required={!this.state.date_selection}
                                disabled={this.state.date_selection}
                                errorMessages="this field is required"
                                onChange={(date) => {
                                    let formData = this.state.formData
                                    formData.from_date = date
                                    this.setState({ formData })
                                }} />
                        </Grid>
                        <Grid item="item" lg={4} md={4} sm={12} xs={12}>
                            <SubTitle title="To" />
                            <LoonsDatePicker className="w-full" value={this.state.formData.to_date} placeholder="to"
                                // minDate={new Date()}
                                //maxDate={new Date()}
                                required={!this.state.date_selection}
                                disabled={this.state.date_selection}
                                errorMessages="this field is required"
                                onChange={(date) => {
                                    let formData = this.state.formData
                                    formData.to_date = date
                                    this.setState({ formData })
                                }} />
                        </Grid>
                        <Grid item="item" className="px-2" lg={4} md={4} sm={12} xs={12}>
                            <SubTitle title="Delivery Mode" />
                            <Autocomplete
                                        disableClearable className="w-full" options={["Pick up", "Deliver"]} onChange={(e, value) => {
                                if (value != null) {
                                    let formData = this.state.formData
                                    formData.drug_store = value
                                        .id
                                    this
                                        .setState({ formData })
                                }
                            }}
                                /*  defaultValue={this.state.all_district.find(
                                (v) => v.id == this.state.formData.district_id
                                )} */
                                // value={this
                                //     .state
                                //     .all_drug_stores
                                //     .find((v) => v.id == this.state.formData.drug_store)} getOptionLabel={(
                                //     option) => option.name
                                //     ? option.name
                                //     : ''} 
                                renderInput={(params) => (
                                    <TextValidator {...params} placeholder="Delivery Mode"
                                        //variant="outlined"
                                        fullWidth="fullWidth" variant="outlined" size="small" />
                                )} />
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
                            <SubTitle title="Search" />

                            <TextValidator className='w-full' placeholder="Order ID"
                                //variant="outlined"

                                // fullWidth="fullWidth" 
                                variant="outlined" size="small"
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
                                }} />
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
                                        <CircularProgress size={30} />
                                    </Grid>
                                )
                        }

                    </Grid>
                </Grid>
            </MainContainer>
        )
    }
}

export default MSD_MSA_ToBeApproved