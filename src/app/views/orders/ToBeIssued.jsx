import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import SearchIcon from '@material-ui/icons/Search'
import { Autocomplete, createFilterOptions } from '@material-ui/lab'
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
    InputAdornment,
    IconButton,
    Icon,
    Tooltip,
    TextField
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
import PharmacyOrderService from 'app/services/PharmacyOrderService'
import localStorageService from 'app/services/localStorageService'
import WarehouseServices from "app/services/WarehouseServices";
import { element } from 'prop-types'
import { dateParse } from 'utils'
import ClinicService from 'app/services/ClinicService'
import PharmacyService from 'app/services/PharmacyService'


const styleSheet = (theme) => ({})

class ToBeIssued extends Component {
    constructor(props) {
        super(props)
        this.state = {

            Loaded: false,
            totalItems: 0,
            totalPages: 0,
            to_be_issued: 0,
            pharmacy_list:[],

            userRoles:null,
            pharmacy_data:[],

            selected_warehouse: null,
            owner_id: null,
            dialog_for_select_warehouse: false,
            all_warehouse_loaded: [],
            pharmacy_list:[],

            filterData: {

                status: ['ALLOCATED', 'ISSUE_SUBMITTED','ISSUE SUBMITTED'],
                date_type: null,
                from_date: null,
                to_date: null,
                from: null,
                limit: 10,
                'order[0]': [
                    'createdAt', 'DESC'
                ],
                type:this.props.type,
                page: 0,
                search: null,
                to_owner_id:null

            },

            filterDataValidation: {
                date_type: true,
                from_date: true,
                to_date: true,
                search: true
            },

            // filterData: {
            //     search: null
            // },

            data: [],
            columns: [
                /* {
                    name: 'id',
                    label: 'id',
                    options: {
                        display: false,
                    },
                }, */
                {
                    // name: 'requested_date',
                    name: 'createdAt',
                    label: 'Requested Date',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                this.state.data[tableMeta.rowIndex].createdAt ?
                                    dateParse(this.state.data[tableMeta.rowIndex].createdAt) : 'N/A'
                            )
                        }
                    },
                },
                {
                    name: 'order_id',
                    label: 'Order ID',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'number_of_items',
                    label: 'Number of Items',
                    options: {
                        display: true,

                    },
                },
                {
                    name: 'drug_store',
                    label: 'Institution',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                this.state.data[tableMeta.rowIndex].toStore.name
                            )
                        },
                    },
                },
                {
                    name: 'required_date',
                    label: 'Required Date',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                this.state.data[tableMeta.rowIndex].required_date ?
                                    dateParse(this.state.data[tableMeta.rowIndex].required_date) : 'N/A'
                            )
                        }
                    },
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
                            return (
                                <>
                                    <Tooltip title='View Order'>
                                        <IconButton
                                            className="text-black"
                                            onClick={() => this.viewIndividualOrder(
                                                this.state.data[tableMeta.rowIndex].id,
                                                this.state.data[tableMeta.rowIndex].Delivery ?
                                                   this.state.data[tableMeta.rowIndex]?.Delivery?.Employee?.id : null
                                            )}
                                        >
                                            <Icon color="primary">visibility</Icon>
                                        </IconButton>
                                    </Tooltip>
                                </>
                            )
                        },
                    },
                },
            ],
        }

    }

    async loadPharmacy() {

        let user_roles = await localStorageService.getItem("userInfo").roles
        let filterData = {
            page: 0,
            limit: 9999,
            issuance_type: ['pharmacy', 'drug_store'],
        }
        let owner_id = await localStorageService.getItem('owner_id')

        let allClinics = await PharmacyService.getPharmacy(owner_id, filterData)
        if (allClinics.status == 200) {
            console.log(allClinics)
            this.setState({
                pharmacy_data: allClinics.data.view.data,
                userRoles:user_roles
            })
        }
    }

    handleSearchButton() {

        let filterData = this.state.filterData;

        if (filterData.search) {
            // alert("Sent the Request")
            this.loadOrderList()
        }
        else {

            let filterDataValidation = this.state.filterDataValidation;

            if (!(filterData.search)) {
                filterDataValidation.search = false;
            }

            this.setState({ filterDataValidation })
        }


    }

    // async handleFilterButton() {

    //     let filterData = this.state.filterData;

    //     if ((filterData.date_type) && (filterData.from_date) && (filterData.to_date) ||
    //         !(filterData.date_type) && !(filterData.from_date) && !(filterData.to_date)) {
    //         //  alert("Sent the Request");
    //         this.loadOrderList(this.state.filterData)
    //     }
    //     else {
    //         let filterDataValidation = this.state.filterDataValidation;

    //         if (!(filterData.date_type)) {
    //             filterDataValidation.date_type = false;
    //         }
    //         if (!(filterData.from_date)) {
    //             filterDataValidation.from_date = false;
    //         }
    //         if (!(filterData.to_date)) {
    //             filterDataValidation.to_date = false;
    //         }

    //         this.setState({ filterDataValidation })
    //     }

    // }
    async setPage(page) {
        //Change paginations
        let filterData = this.state.filterData
        filterData.page = page
        this.setState({
            filterData
        }, () => {
            console.log("New filterData", this.state.filterData)
            this.loadOrderList()
        })
    }

    viewIndividualOrder(id, pickUpPersonID) {
        window.location = `/hospital-ordering/all-items/${id}?pickUpPersonID=${pickUpPersonID}`;
    }

    async loadOrderList() {

        this.setState({ Loaded: false })
        var user = await localStorageService.getItem('userInfo')
        let params = this.state.filterData
        if (user.roles[0] === 'NMQAL Pharmacist'){
            params.type = ['Order','SAMPLE']
        }
        let res = await PharmacyOrderService.getAllOrders(params);
        if (res.status) {

            this.setState({
                data: res.data.view.data,
                Loaded: true,
                to_be_issued: res.data.view.totalItems,
                totalItems: res.data.view.totalItems
            }, () => {
                this.render()
            })

        } else {
            console.log(res.status);
        }

    }

    async loadWarehouses() {
        // this.setState({ Loaded: false })
        var user = await localStorageService.getItem('userInfo');
        console.log('user', user)
        var id = user.id;
        var all_pharmacy_dummy = [];
        var selected_warehouse_cache = await localStorageService.getItem('Selected_Warehouse');
        if (!selected_warehouse_cache) {
            this.setState({ dialog_for_select_warehouse: true })
        }
        else {
            // this.state.genOrder.created_by = id
            // this.state.genOrder.warehouse_id = selected_warehouse_cache.id
            // this.state.getCartItems.warehouse_id = selected_warehouse_cache.id
            // this.state.suggestedWareHouses.warehouse_id = selected_warehouse_cache.id
            // this.state.formData.owner_id = selected_warehouse_cache.owner_id
            let filterData = this.state.filterData;
            filterData.from = selected_warehouse_cache.id
            this.setState({ 
                filterData,
                owner_id: selected_warehouse_cache.owner_id, 
                selected_warehouse: selected_warehouse_cache.id, 
                dialog_for_select_warehouse: false, 
                warehouseSelectDone: true 
            })
            console.log("this.state.selected_warehouse",this.state.selected_warehouse)
            console.log("filterData.from",this.state.filterData.from)
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

    async getPharmacyDetails(search) {
        let params = {
            limit: 500,
            page: 0,
            issuance_type: ['Hospital', 'RMSD Main', 'MSD Main'],
            search: search
        };

        let res = await ClinicService.fetchAllClinicsNew(params, null);

        if (res.status === 200) {
            console.log('phar------------------>>>>> check', res);

            this.setState({
                pharmacy_list: res.data.view.data
            });
        }
    }

    componentDidMount() {

        this.loadWarehouses()
        this.loadOrderList()
        this.loadPharmacy()

    }

    render() {
        return (

            <Fragment>
                <ValidatorForm
                    className=""
                    onSubmit={() => this.SubmitAll()}
                    onError={() => null}>

                    <Grid container>
                        <Grid lg={12} md={12} sm={12} xs={12} style={{ textAlign: 'end' }} className='pr-5'>
                            <h3>No of to be Issued : {this.state.to_be_issued}</h3>
                        </Grid>
                        <Grid item="item" className="px-2" lg={2} md={2} sm={2} xs={2}>
                            <SubTitle title="Institution" />
                            <Autocomplete
                                disableClearable
                                className="w-full"
                                options={this.state.pharmacy_list || []} 
                                onChange={(e, value) => {
                                    if (value != null) {
                                        let formData = this.state.filterData;
                                        formData.to_owner_id = value.owner_id;
                                        this.setState({ formData });
                                    } else {
                                        let formData = this.state.filterData;
                                        formData.to_owner_id = null;
                                        this.setState({ formData });
                                    }
                                }}
                                value={
                                    this.state.all_pharmacy &&
                                    this.state.all_pharmacy.find((v) => v.owner_id === this.state.filterData.to_owner_id)
                                }
                                getOptionLabel={(option) => (option && option.name ? (option.name + ' - ' + option?.Department?.name) : '')}
                                renderInput={(params) => (
                                    <TextValidator
                                        {...params}
                                        placeholder="Institution"
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        onChange={(e) => {
                                            if (e.target.value.length > 3) {
                                                this.getPharmacyDetails(e.target.value);
                                            }
                                        }}
                                    />
                                )}
                            />
                        </Grid>

                        {this.state.userRoles !== 'MSD MSA' || this.state.userRoles !== 'RMSD OIC' || this.state.userRoles !== 'RMSD MSA' 
                || this.state.userRoles !== 'RMSD Pharmacist' || this.state.userRoles !== 'RMSD Distribution Officer' ? (
                        <Grid item lg={2} md={2} sm={2} xs={2}>
                                    <SubTitle title="Pharmacy" />
                                    <Autocomplete
                                        disableClearable
                                        className="w-full"
                                        options={this.state.pharmacy_data}
                                        getOptionLabel={(option) =>
                                            option.name != null
                                                ? option.name
                                                : null
                                        }
                                        onChange={(e, value) => {
                                            if (value == null) {
                                                let incommingFilters =
                                                    this.state.filterData
        
                                                incommingFilters.to = null
                                                this.setState({
                                                    incommingFilters,
                                                })
                                            } else {
                                                let incommingFilters =
                                                    this.state.filterData
                                                incommingFilters.to = value.id
                                                this.setState({
                                                    incommingFilters,
                                                })
                                            }
                                        }}
                                        //value={this.state.pharmacy_data.find((obj) => obj.id == this.state.incommingFilters.)}

                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                placeholder="Pharmacy"
                                                //variant="outlined"
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                            />
                                        )}
                                    /> 
                                </Grid>
                            ) : null}

                        <Grid item lg={2} md={2} sm={2} xs={2} className="px-2">
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
                                    let filterData = this.state.filterData
                                    if (value != null) {

                                        let filterDataValidation = this.state.filterDataValidation;
                                        filterDataValidation.date_type = true;

                                        filterData.date_type = value.value;

                                        this.setState({ filterDataValidation })

                                    } else {
                                        filterData.date_type = null
                                    }

                                    this.setState({ filterData })
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
                            {
                                this.state.filterDataValidation.date_type ?
                                    ("") :
                                    (<span style={{ color: 'red' }}>this field is required</span>)
                            }


                        </Grid>

                        <Grid item lg={2} md={2} sm={2} xs={2} className="px-2">
                            <SubTitle title="Date Range (From)" />
                            <DatePicker
                                className="w-full"
                                value={
                                    this.state.filterData.from_date
                                }
                                placeholder="Date Range (From)"
                                // minDate={new Date()}
                                // maxDate={new Date()}
                                // required={true}
                                // errorMessages="this field is required"
                                onChange={(date) => {
                                    let filterData = this.state.filterData
                                    if (date) {
                                        let filterDataValidation = this.state.filterDataValidation;
                                        filterDataValidation.from_date = true;

                                        filterData.from_date = date;

                                        this.setState({ filterDataValidation })
                                    } else {
                                        filterData.from_date = null
                                    }

                                    this.setState({
                                        filterData,
                                    })
                                    console.log("filterData", this.state.filterData);
                                }}
                            />
                            {
                                this.state.filterDataValidation.from_date ?
                                    ("") :
                                    (<span style={{ color: 'red' }}>this field is required</span>)
                            }

                        </Grid>

                        <Grid item lg={2} md={2} sm={2} xs={2} className="px-2">
                            <SubTitle title="Date Range (to)" />
                            <DatePicker
                                className="w-full"

                                value={
                                    this.state.filterData.to_date
                                }
                                placeholder="Date Range (To)"
                                // minDate={new Date()}
                                // maxDate={new Date()}
                                // required={true}
                                // errorMessages="this field is required"
                                onChange={(date) => {
                                    let filterData = this.state.filterData
                                    if (date) {
                                        let filterDataValidation = this.state.filterDataValidation;
                                        filterDataValidation.to_date = true;

                                        filterData.to_date = date;

                                        this.setState({ filterDataValidation })
                                    } else {
                                        filterData.to_date = null
                                    }

                                    this.setState({
                                        filterData,
                                    })
                                    console.log("filterData", this.state.filterData);
                                }}
                            />
                            <>
                                {
                                    this.state.filterDataValidation.to_date ?
                                        ("") :
                                        (<span style={{ color: 'red' }}>this field is required</span>)
                                }
                            </>


                        </Grid>
                        <Grid item lg={2} md={2} sm={2} xs={2} className="text-left px-2">
                            <Button
                                className="mt-6"
                                progress={false}
                                scrollToTop={false}
                                // type='submit'
                                startIcon="search"
                                onClick={() => { this.setPage(0) }}
                            >
                                <span className="capitalize">Filter</span>
                            </Button>
                        </Grid>
                        {/* <Grid item lg={1} md={1} sm={1} xs={1} ></Grid> */}
                        <Grid item lg={2} md={2} sm={2} xs={2} style={{ display: 'flex', flexDirection: 'column' }}>

                            <TextValidator
                                className='w-full mt-5'
                                placeholder="Order ID"
                                //variant="outlined"
                                // fullWidth="fullWidth" 
                                variant="outlined"
                                size="small"
                                value={this.state.filterData.search}
                                onChange={(e, value) => {

                                    let filterData = this.state.filterData
                                    if (e.target.value) {

                                        let filterDataValidation = this.state.filterDataValidation;
                                        filterDataValidation.search = true;

                                        filterData.search = e.target.value;

                                        this.setState({ filterDataValidation })

                                    } else {
                                        filterData.search = null
                                    }

                                    this.setState({ filterData })

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
                            {
                                this.state.filterDataValidation.search ?
                                    ("") :
                                    (<span style={{ color: 'red' }}>this field is required</span>)
                            }
                        </Grid>
                        <Grid item lg={1} md={1} sm={1} xs={1} className="text-left px-2">
                            <Button
                                className="text-left px-2 mt-6"
                                progress={false}
                                scrollToTop={false}
                                // type='submit'
                                startIcon="search"
                                onClick={() => { this.handleSearchButton() }}
                            >
                                <span className="capitalize">Search</span>
                            </Button>
                        </Grid>




                    </Grid>
                </ValidatorForm>
                <Grid container className="mt-4 pb-5">
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        {
                            this.state.Loaded ?
                                <>
                                    <LoonsTable
                                        //title={"All Aptitute Tests"}

                                        id={'toBeIssued'}
                                        data={
                                            this.state.data
                                        }
                                        columns={
                                            this.state.columns
                                        }
                                        options={{
                                            pagination: true,
                                            serverSide: true,
                                            count: this.state.totalItems,
                                            rowsPerPage: this.state.filterData.limit,
                                            page: this.state.filterData.page,

                                            print: true,
                                            viewColumns: true,
                                            download: true,
                                            onTableChange: (
                                                action,
                                                tableState
                                            ) => {
                                                console.log(
                                                    action,
                                                    tableState
                                                )
                                                switch (
                                                action
                                                ) {
                                                    case 'changePage':
                                                        this.setPage(
                                                            tableState.page
                                                        )
                                                        break
                                                    case 'sort':
                                                        // this.sort(tableState.page, tableState.sortOrder);
                                                        break
                                                    default:
                                                        console.log(
                                                            'action not handled.'
                                                        )
                                                }
                                            },
                                        }}
                                    ></LoonsTable>
                                </> :
                                (
                                    //load loading effect
                                    <Grid className="justify-center text-center w-full pt-12">
                                        <CircularProgress
                                            size={30}
                                        />
                                    </Grid>
                                )
                        }

                    </Grid>
                </Grid>
            </Fragment>
        )
    }
}

export default withStyles(styleSheet)(ToBeIssued)