import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Autocomplete, createFilterOptions } from '@material-ui/lab'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import SearchIcon from '@material-ui/icons/Search'
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import DescriptionIcon from '@material-ui/icons/Description';
import CloseIcon from '@material-ui/icons/Close';
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
    Tooltip,
    Dialog,
    Typography,
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
import PharmacyService from 'app/services/PharmacyService'
import { map } from 'lodash'
import AddPickUpPerson from './AddPickUpPerson'
import VehicleService from 'app/services/VehicleService'
import localStorageService from 'app/services/localStorageService'
import WarehouseServices from "app/services/WarehouseServices";
import { dateParse, dateTimeParse } from 'utils'
import ClinicService from 'app/services/ClinicService'

const styleSheet = (theme) => ({})

class AllOrder_DeliveryDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Loaded: false,
            deliveryDataLoaded: false,
            totalItems: 0,
            totalPages: 0,
            all_orders: 0,

            userRoles:null,
            pharmacy_data:[],

            selected_warehouse: null,
            owner_id: null,
            dialog_for_select_warehouse: false,
            all_warehouse_loaded: [],

            drugStoreData: [],
            

            employees: null,
            remarks: null,
            other_remark: '',
            other_remark_check: false,

            updateOrder: {
                delivery_id: null,
                // order_exchange_id: null,
                pickup_person_id: null,
            },

            deliver_mode:null,

            order: {
                order_exchange_id: null,
                pickup_person_id: null,
                remarks: [],
            },
            pickUpFilterData: {
                // page: 0,
                // limit: 20,
                type: ["Helper","Driver","Health Service Assistant","Medical Officer"]
            },

            selectedOrder: null,
            pickUpDialogView: false,
            remarkDialogView: false,
            updatePickUp: false,


            filterData: {
                status: null,
                date_type: null,
                from_date: null,
                to_date: null,
                // to: '600329c7-f99f-4f04-9f7c-240090526aee',
                // from: '8688da15-9f31-40a5-83e8-4a603479155a',
                from: null,
                'order[0]': [
                    'createdAt', 'DESC'
                ],
                type:this.props.type,
                to: null,
                limit: 10,
                page: 0,
                search: null,
                to_owner_id:null
            },
            pharmacy_list:[],

            filterDataValidation: {
                date_type: true,
                from_date: true,
                to_date: true,
                search: true,
                to: true,
                status: true
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
                    name: 'drug_store',
                    label: 'Institution',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (

                                this.state.data[tableMeta.rowIndex].toStore.name

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
                    name: 'status',
                    label: 'Status',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'pickUpPerson',
                    label: 'Pick Up Person',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {

                            return (

                                this.state.data[tableMeta.rowIndex].Delivery ?
                                    (this.state.data[tableMeta.rowIndex].Delivery?.Employee?.name) :
                                    ("N/A")



                            )
                        }
                    },
                },
                {
                    name: 'contact_number',
                    label: 'Contact Number',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {

                            return (

                                this.state.data[tableMeta.rowIndex].Delivery ?
                                    ("-") :
                                    ("N/A")



                            )
                        }
                    },
                },
                {
                    name: 'remarks',
                    label: 'Remarks',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                this.state.data[tableMeta.rowIndex].Delivery ?
                                    (
                                        this.state.data[tableMeta.rowIndex].Delivery.Remarks.map((item) => {
                                            if (item.Remarks) {
                                                return (
                                                    <>
                                                        <p>{item.Remarks.remark}</p>
                                                        <p>{item.other_remarks}</p>
                                                    </>

                                                )
                                            }

                                            else {

                                                return (<p>{item.other_remarks}</p>)

                                            }
                                            // return (<p>{item.other_remarks}</p>)
                                        })
                                    ) :
                                    ("N/A")

                            )


                        }
                    },
                },
                {
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
                    name: 'issued_date',
                    label: 'Issued Date',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                this.state.data[tableMeta.rowIndex].issued_date ?
                                    dateParse(this.state.data[tableMeta.rowIndex].issued_date) : 'N/A'

                            )
                        }
                    },
                },
                {
                    name: 'time_slot',
                    label: 'Time Slot',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {

                            return (

                                this.state.data[tableMeta.rowIndex].Delivery ?
                                    ((this.state.data[tableMeta.rowIndex].Delivery.time_from && this.state.data[tableMeta.rowIndex].Delivery.time_to) ?
                                        (this.state.data[tableMeta.rowIndex].Delivery.time_from + "-" + this.state.data[tableMeta.rowIndex].Delivery.time_to) :
                                        ("N/A"))
                                    :
                                    ("N/A")

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
                                this.state.data[tableMeta.rowIndex].Delivery ?
                                    (

                                        (tableMeta.rowData[3] != "REJECTED") ?
                                            (
                                                <>
                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                        <Tooltip title='Edit Delivery Details'>
                                                            <IconButton
                                                                className="text-black"
                                                                onClick={
                                                                    () => {
                                                                        this.handleUpdatePickUpDetails(this.state.data[tableMeta.rowIndex])
                                                                    }
                                                                }

                                                            >
                                                                <Icon style={{ fontSize: 'large' }}>mode_edit_outline</Icon>
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title='View Order'>
                                                            <IconButton
                                                                className="text-black"
                                                                onClick={() => this.viewIndividualOrder(
                                                                    this.state.data[tableMeta.rowIndex].id,
                                                                    this.state.data[tableMeta.rowIndex].Delivery ?
                                                                       this.state.data[tableMeta.rowIndex]?.Delivery?.Employee?.id : null
                                                                )}>


                                                                <Icon color="primary" style={{ fontSize: 'large' }}>visibility</Icon>
                                                            </IconButton>
                                                        </Tooltip>

                                                        <Tooltip title='View Delivery Person Profile'>
                                                            <IconButton
                                                                className="text-black"
                                                                onClick={() => { window.location = `/order/ppprofile/${this.state.data[tableMeta.rowIndex].Delivery.Employee.id}` }}

                                                            >
                                                                <Icon style={{ fontSize: 'large' }}>person</Icon>
                                                            </IconButton>
                                                        </Tooltip>
                                                    </div>

                                                </>

                                            )
                                            :
                                            (
                                                <Tooltip title='View Order'>
                                                    <IconButton
                                                        className="text-black"
                                                        onClick={() => this.viewIndividualOrder(
                                                            this.state.data[tableMeta.rowIndex].id,
                                                            this.state.data[tableMeta.rowIndex].Delivery ?
                                                               this.state.data[tableMeta.rowIndex]?.Delivery?.Employee?.id : null
                                                        )}>


                                                        <Icon color="primary">visibility</Icon>
                                                    </IconButton>
                                                </Tooltip>
                                            )


                                    ) :
                                    (
                                        <>
                                            {
                                                (tableMeta.rowData[3] != "REJECTED") ?
                                                    (
                                                        <>
                                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                <Tooltip title='Add PickUp Person'>
                                                                    <IconButton
                                                                        // disabled={!((this.state.data[tableMeta.rowIndex].pickUpPerson == '') || (this.state.data[tableMeta.rowIndex].pickUpPerson == null))}
                                                                        className="text-black"
                                                                        onClick={() => this.handleAddPickUpDetails(this.state.data[tableMeta.rowIndex])
                                                                            // this.setState({ selectedOrder: this.state.data[tableMeta.rowIndex], pickUpDialogView: true })


                                                                        }
                                                                    >
                                                                        <PersonAddIcon />
                                                                    </IconButton>
                                                                </Tooltip>

                                                                <Tooltip title='View Order'>
                                                                    <IconButton
                                                                        className="text-black"
                                                                        onClick={() => this.viewIndividualOrder(
                                                                            this.state.data[tableMeta.rowIndex].id,
                                                                            this.state.data[tableMeta.rowIndex].Delivery ?
                                                                               this.state.data[tableMeta.rowIndex]?.Delivery?.Employee?.id : null
                                                                        )}>

                                                                        <Icon color="primary">visibility</Icon>
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </div>

                                                        </>
                                                    )
                                                    :
                                                    (
                                                        <Tooltip title='View Order'>
                                                            <IconButton
                                                                className="text-black"
                                                                onClick={() => this.viewIndividualOrder(
                                                                    this.state.data[tableMeta.rowIndex].id,
                                                                    this.state.data[tableMeta.rowIndex].Delivery ?
                                                                       this.state.data[tableMeta.rowIndex]?.Delivery?.Employee?.id : null
                                                                )}>


                                                                <Icon color="primary">visibility</Icon>
                                                            </IconButton>
                                                        </Tooltip>
                                                    )

                                            }

                                        </>
                                    )





                            )
                        },
                    },
                },
            ],

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
            console.log("this.state.selected_warehouse", this.state.selected_warehouse)
            console.log("filterData.from", this.state.filterData.from)
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
    handleUpdatePickUpDetails(orderData) {
        // if(this.state.order.Delivery){
        //     this.setState({ updatePickUp: true })
        // }
        this.setState({ updatePickUp: true })

        let updateOrder = this.state.updateOrder;
        // updateOrder.order_exchange_id = orderData.id
        updateOrder.pickup_person_id = orderData.Delivery.pickup_person_id
        updateOrder.delivery_id = orderData.Delivery.id
        this.setState({ updateOrder })

        this.setState({ pickUpDialogView: true })
        this.loadDeliveryData();

    }

    handleAddPickUpDetails(orderData) {
        // if(this.state.order.Delivery){
        //     this.setState({ updatePickUp: true })
        // }
        this.setState({ pickUpDialogView: true })

        let order = this.state.order;
        order.order_exchange_id = orderData.id
        this.setState({ order })

        this.loadDeliveryData();

    }

    async onSubmit() {
        // this.state.order.remarks=[...this.state.remarks,this.state.other_remark]
        // console.log(this.state.order);
        // console.log('other',this.state.other_remark)
        if (this.state.updatePickUp) {

            let body = { pickup_person_id: this.state.updateOrder.pickup_person_id, remarks: [] }
            console.log("body", body)
            let res = await PharmacyOrderService.updatePickUpDetails(this.state.updateOrder.delivery_id, body)
            if (res.status && res.status == 200) {
                this.setState({
                    alert: true,
                    message: 'Order Updated Successfully',
                    severity: 'success',
                })
                // window.location.reload();
            } else {
                this.setState({
                    alert: true,
                    message: 'Order Updated Unsuccessful',
                    severity: 'error',
                })
            }
        } else {
            let neww = [...this.state.order.remarks, { other_remarks: this.state.other_remark }]
            this.state.order.remarks = neww

            let res = await PharmacyOrderService.setUpDeliveries(this.state.order)

            if (res.status && res.status == 201) {
                this.setState({
                    alert: true,
                    message: 'Order Updated Successfully',
                    severity: 'success',
                })
                // window.location.reload();
            } else {
                this.setState({
                    alert: true,
                    message: 'Order Updated Unsuccessful',
                    severity: 'error',
                })
            }
        }
        this.setState({ pickUpDialogView: false, updatePickUp: false })
        this.loadOrderList()
    }

    async loadDeliveryData() {
        this.setState({ deliveryDataLoaded: false })
        let user_res = await VehicleService.getVehicleUsers(this.state.pickUpFilterData);
        if (user_res.status == 200) {
            console.log('data', user_res.data.view.data);
            this.setState({
                employees: user_res.data.view.data,
                // totalPages: user_res.data.view.totalPages,
                // totalItems: user_res.data.view.totalItems,
            })
        }

        let res = await PharmacyOrderService.getRemarks()
        if (res.status == 200) {
            let remarks = [...res.data.view.data, { remark: 'Other' }]
            this.setState({
                remarks: remarks,
                deliveryDataLoaded: true
            },
                () => { console.log(this.state.remarks); this.render() })
            return;
        }

    }

    // async handleFilterButton() {

    //     let filterData = this.state.filterData;

    //     if (((filterData.date_type) && (filterData.from_date) && (filterData.to_date) && (filterData.status) && (filterData.from)) ||
    //         (!(filterData.date_type) && !(filterData.from_date) && !(filterData.to_date) && !(filterData.status) && !(filterData.from)) ||
    //         ((filterData.date_type) && (filterData.from_date) && (filterData.to_date) && !(filterData.status) && !(filterData.from)) ||
    //         (!(filterData.date_type) && !(filterData.from_date) && !(filterData.to_date) && !(filterData.status) && (filterData.from)) ||
    //         (!(filterData.date_type) && !(filterData.from_date) && !(filterData.to_date) && (filterData.status) && !(filterData.from)) ||
    //         (!(filterData.date_type) && !(filterData.from_date) && !(filterData.to_date) && (filterData.status) && (filterData.from))) {
    //         // alert("Sent the Request");
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
                all_orders: res.data.view.totalItems,
                totalItems: res.data.view.totalItems
            }, () => {
                this.render()
            })

        } else {
            console.log(res.status);
        }

    }

    async loadDrugStoreData() {
        //Fetch department data

        //let res = await PharmacyService.fetchAllDataStorePharmacy('001', {})

        let owner_id=await localStorageService.getItem('owner_id')
        let userInfo = await localStorageService.getItem('userInfo')

        if (userInfo.roles.includes('RMSD MSA') || userInfo.roles.includes('RMSD Distribution Officer')) {
            owner_id = null
        }

        let res=await WarehouseServices.getAllWarehousewithOwner({store_type:'drug_store'},owner_id)

        console.log("warehouses",res)
        if (200 == res.status) {
            this.setState({
                drugStoreData: res.data.view.data,
            })
            console.log("this.state.drugStoreData", this.state.drugStoreData);
        }
    }

    async getPharmacyDetails(search) {
        let params = {
            limit: 500,
            page: 0,
            issuance_type: ['Hospital', 'RMSD Main','MSD Main'],
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

    componentDidMount() {

        this.loadWarehouses()
        this.loadDrugStoreData()
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

                        <Grid item lg={12} md={12} sm={12} xs={12} style={{ display: 'flex', alignItems: 'end', justifyContent: 'end' }}>
                            <h2>No of All Orders : {this.state.all_orders}</h2>
                        </Grid>

                    </Grid>
                    <Grid container className='mt-5'>

                    <Grid item="item" className="px-2" lg={3} md={3} sm={3} xs={3}>
                            <SubTitle title="Institution" />
                            <Autocomplete
                                disableClearable
                                className="w-full"
                                options={this.state.pharmacy_list || []} 
                                onChange={(e, value) => {
                                    if (value != null) {
                                        let formData = this.state.filterData
                                        formData.to_owner_id = value.owner_id;
                                        this.setState({ formData });
                                    } else {
                                        let formData = this.state.filterData
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

                        <Grid item lg={3} md={3} sm={3} xs={3} className="px-2">
                            <SubTitle title={"Status"}></SubTitle>
                            <Autocomplete
                                        disableClearable
                                className="w-full"
                                options={[{ value: "ORDERED" }, { value: "APPROVED" }, { value: "REJECTED" }, { value: "ISSUED" }, { value: "RECEIVED" }, { value: "COMPLETED" }, { value: "Pending" }]}
                                /*  defaultValue={dummy.find(
                                     (v) => v.value == ''
                                 )} */
                                getOptionLabel={(option) => option.value}
                                getOptionSelected={(option, value) =>
                                    console.log("ok")
                                }
                                onChange={(event, value) => {
                                    let filterData = this.state.filterData
                                    if (value != null) {

                                        let filterDataValidation = this.state.filterDataValidation;
                                        filterDataValidation.status = true;

                                        filterData.status = value.value
                                        this.setState({ filterDataValidation })

                                    } else {
                                        filterData.status = null
                                    }
                                    this.setState({ filterData })
                                }}

                                renderInput={(params) => (
                                    <TextValidator
                                        {...params}
                                        placeholder="Status"
                                        //variant="outlined"
                                        //value={}
                                        fullWidth
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        variant="outlined"
                                        size="small"
                                        validators={[
                                            'required',
                                        ]}
                                        errorMessages={[
                                            'this field is required',
                                        ]}
                                    />
                                )}
                            />
                            {
                                this.state.filterDataValidation.status ?
                                    ("") :
                                    (<span style={{ color: 'red' }}>this field is required</span>)
                            }

                        </Grid>
                        <Grid item lg={3} md={3} sm={3} xs={3} className="px-2">
                            <SubTitle title={"Drug Store"}></SubTitle>
                            <Autocomplete
                                        disableClearable
                                className="w-full"
                                options={this.state.drugStoreData.sort((a,b)=> (a.name?.localeCompare(b.name)))}
                                /*  defaultValue={dummy.find(
                                     (v) => v.value == ''
                                 )} */
                                getOptionLabel={(option) =>
                                    option.name ?
                                        (option.name)
                                        : ('')
                                }
                                getOptionSelected={(option, value) =>
                                    console.log("ok")
                                }
                                onChange={(event, value) => {

                                    let filterData = this.state.filterData
                                    if (value != null) {

                                        let filterDataValidation = this.state.filterDataValidation;
                                        filterDataValidation.to = true;

                                        filterData.drug_store_id = value.id
                                        filterData.to = value.id

                                        this.setState({ filterDataValidation })


                                    } else {
                                        filterData.to = null
                                    }
                                    this.setState({ filterData })

                                }}
                                value={this.state.drugStoreData.find((v) =>
                                    v.id == this.state.filterData.drug_store_id
                                )}
                                renderInput={(params) => (
                                    <TextValidator
                                        {...params}
                                        placeholder="Drug Store"
                                        //variant="outlined"
                                        //value={}
                                        fullWidth
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        variant="outlined"
                                        size="small"
                                        validators={[
                                            'required',
                                        ]}
                                        errorMessages={[
                                            'this field is required',
                                        ]}
                                    />
                                )}
                            />
                            {
                                this.state.filterDataValidation.to ?
                                    ("") :
                                    (<span style={{ color: 'red' }}>this field is required</span>)
                            }

                        </Grid>

                        <Grid item lg={3} md={3} sm={3} xs={3} className="px-2">
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

                                        filterData.date_type = value.value

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
                                        validators={[
                                            'required',
                                        ]}
                                        errorMessages={[
                                            'this field is required',
                                        ]}
                                    />
                                )}
                            />
                            {
                                this.state.filterDataValidation.date_type ?
                                    ("") :
                                    (<span style={{ color: 'red' }}>this field is required</span>)
                            }

                        </Grid>

                        <Grid item lg={3} md={3} sm={3} xs={3} className="px-2">
                            <SubTitle title="Date Range (From)" />
                            <DatePicker
                                className="w-full"
                                value={
                                    this.state.filterData.from_date
                                }
                                placeholder="Date Range (From)"
                                // minDate={new Date()}
                                maxDate={new Date()}
                                // required={true}
                                // errorMessages="this field is required"
                                onChange={(date) => {
                                    let filterData = this.state.filterData
                                    if (date) {
                                        let filterDataValidation = this.state.filterDataValidation;
                                        filterDataValidation.from_date = true;

                                        filterData.from_date = date

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

                        <Grid item lg={3} md={3} sm={3} xs={3} className="px-2">
                            <SubTitle title="Date Range (to)" />
                            <DatePicker
                                className="w-full"

                                value={
                                    this.state.filterData.to_date
                                }
                                placeholder="Date Range (To)"
                                // minDate={new Date()}
                                maxDate={new Date()}
                                // required={true}
                                // errorMessages="this field is required"
                                onChange={(date) => {
                                    let filterData = this.state.filterData
                                    if (date) {

                                        let filterDataValidation = this.state.filterDataValidation;
                                        filterDataValidation.to_date = true;

                                        filterData.to_date = date

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
                            {
                                this.state.filterDataValidation.to_date ?
                                    ("") :
                                    (<span style={{ color: 'red' }}>this field is required</span>)
                            }
                        </Grid>

                        <Grid item lg={1} md={1} sm={1} xs={1} className="px-2" >
                            <Button
                                className="mt-6"
                                progress={false}
                                scrollToTop={false}
                                // type='submit'
                                startIcon="search"
                                onClick={() => this.setPage(0)}
                            >
                                <span className="capitalize">Filter</span>
                            </Button>
                        </Grid>
                        {/* <Grid item lg={5} md={5} sm={5} xs={5}>

                        </Grid> */}

                        <Grid container>

                        
                        <Grid item lg={2} md={2} sm={2} xs={2} style={{ display: 'flex', flexDirection: 'column' }}>

                            <TextValidator
                                className='w-full mt-5 pl-2'
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
                        <Grid item lg={1} md={1} sm={1} xs={1} className="text-right px-2">
                            <Button
                                className="text-right mt-6"
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

                    </Grid>

                </ValidatorForm>
                <Grid item lg={12} className="text-left px-2">
                    <Button
                        className="mt-5"
                        progress={
                            false
                        }
                        // type="submit"
                        scrollToTop={
                            true
                        }
                        //navigate to assign drug screen
                        onClick={() => {
                            window.location = "/order/newpickupperson/"
                        }}
                    >
                        <span className="capitalize">
                            Add New Pick Up Person
                        </span>
                    </Button>
                </Grid>
                <Grid container className="mt-2 pb-5">
                    <Grid item lg={12} md={12} sm={12} xs={12} >
                        {
                            this.state.Loaded ?
                                <>
                                    <LoonsTable
                                        //title={"All Aptitute Tests"}

                                        id={'all_orders_delivery_details'}
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
                                            onTableChange: (action, tableState) => {
                                                console.log(action, tableState)
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
                                </>
                                : (
                                    //loading effect
                                    <Grid className="justify-center text-center w-full pt-12">
                                        <CircularProgress size={30} />
                                    </Grid>
                                )
                        }

                    </Grid>
                    <Dialog
                        fullWidth
                        maxWidth="md"
                        open={this.state.pickUpDialogView}
                        onClose={() => { this.setState({ pickUpDialogView: false, updatePickUp: false }) }}
                    >
                        <div className="w-full h-full px-5 py-5">
                            {
                                this.state.updatePickUp ?
                                    (
                                        <Fragment >
                                            <CardTitle title="Update Pick Up Person" />
                                            {this.state.deliveryDataLoaded ?
                                                <div className="w-full">
                                                    <ValidatorForm
                                                        onSubmit={() => this.onSubmit()}
                                                    >
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} lg={12} >
                                                                {/* <Typography variant='h6' className="font-semibold"> Pick Up Person :</Typography> */}
                                                                <SubTitle title="Pick Up Person :" />
                                                                <Autocomplete
                                        disableClearable
                                                                    className="w-full"
                                                                    options={this.state.employees}
                                                                    onChange={(e, value) => {
                                                                        if (null != value) {
                                                                            console.log("value.id", value.id)
                                                                            let updateOrder = this.state.updateOrder;
                                                                            updateOrder.pickup_person_id = value.id
                                                                            this.setState({ updateOrder }, () => { console.log("updatedvalue.id", this.state.updateOrder.pickup_person_id) })

                                                                        }
                                                                    }}
                                                                    value={this.state.employees.find((v) =>
                                                                        v.id == this.state.updateOrder.pickup_person_id
                                                                    )}
                                                                    getOptionLabel={(option) => {
                                                                        console.log("option", option)
                                                                        return option.name ? option.name : ''

                                                                    }

                                                                    }
                                                                    renderInput={(params) => (
                                                                        <TextValidator
                                                                            {...params}
                                                                            placeholder="User Type"
                                                                            variant="outlined"
                                                                            size="small"
                                                                        />
                                                                    )}
                                                                />
                                                            </Grid>

                                                            <Grid item lg={1} md={1} sm={12} xs={12} style={{ display: 'flex', alignItems: 'center' }}>
                                                                <Button
                                                                    className="mt-2"
                                                                    progress={false}
                                                                    type="submit"
                                                                    scrollToTop={true}
                                                                //onClick={this.handleChange}
                                                                >
                                                                    <span className="capitalize">Save</span>
                                                                </Button>
                                                            </Grid>
                                                        </Grid>
                                                    </ValidatorForm>
                                                </div>
                                                : null}
                                            {/* Content End */}

                                        </Fragment>
                                    ) :
                                    (

                                        <Fragment >
                                            <CardTitle title="Add Pick Up Person and Remarks" />
                                            {this.state.deliveryDataLoaded ?
                                                <div className="w-full">
                                                    <ValidatorForm
                                                        onSubmit={() => this.onSubmit()}
                                                    >
                                                        <Grid container spacing={2}>

                                                            <Grid item xs={12} lg={12} >
                                                                {/* <Typography variant='h6' className="font-semibold"> Pick Up Person :</Typography> */}
                                                                <SubTitle title="Pick Up Person :" />
                                                                <Autocomplete
                                        disableClearable
                                                                    className="w-full"
                                                                    options={this.state.employees
                                                                    }
                                                                    onChange={(e, value) => {
                                                                        if (null != value) {
                                                                            let order = this.state.order;
                                                                            order.pickup_person_id = value.id
                                                                            this.setState({ order })
                                                                        }
                                                                    }}
                                                                    // value={appConst.user_type.find(
                                                                    //     (v) =>
                                                                    //         v.type ===
                                                                    //         this.state.formData
                                                                    //             .type
                                                                    // )}
                                                                    getOptionLabel={(option) =>
                                                                        option.name ? option.name : ''
                                                                    }
                                                                    renderInput={(params) => (
                                                                        <TextValidator
                                                                            {...params}
                                                                            placeholder="User Type"
                                                                            variant="outlined"
                                                                            size="small"
                                                                        />
                                                                    )}
                                                                />
                                                            </Grid>
                                                            <Grid item xs={12} lg={12} >
                                                                {/* <Typography variant='h6' className="font-semibold"> Remarks :</Typography> */}
                                                                <SubTitle title="Remarks :" />
                                                                <Autocomplete
                                        disableClearable
                                                                    multiple={true}
                                                                    className="w-full"
                                                                    options={this.state.remarks
                                                                    }
                                                                    onChange={(e, value) => {
                                                                        console.log('remarks', value);
                                                                        if (null != value) {

                                                                            let check = value.find((element, index) => {
                                                                                if (element.remark == 'Other') {
                                                                                    return true;
                                                                                }
                                                                                else {
                                                                                    return false
                                                                                }
                                                                            })

                                                                            if (check) {
                                                                                console.log('insidedefefe');
                                                                                let checkss = this.state.other_remark_check;
                                                                                this.setState({
                                                                                    other_remark_check: !checkss
                                                                                }, () => console.log('other_remark_check', this.state.other_remark_check))
                                                                            }

                                                                            else {
                                                                                let order = this.state.order;
                                                                                order.remarks = []
                                                                                value.forEach(element => { order.remarks.push({ 'remarks_id': element.id }) })
                                                                                this.setState({ order })
                                                                                this.setState({ other_remark_check: false })
                                                                            }

                                                                        }
                                                                    }}
                                                                    // value={appConst.user_type.find(
                                                                    //     (v) =>
                                                                    //         v.type ===
                                                                    //         this.state.formData
                                                                    //             .type
                                                                    // )}
                                                                    getOptionLabel={(option) =>
                                                                        option.remark ? option.remark : ''
                                                                    }
                                                                    renderInput={(params) => (
                                                                        <TextValidator
                                                                            {...params}
                                                                            placeholder="Select remarks"
                                                                            variant="outlined"
                                                                            size="small"
                                                                        />
                                                                    )}
                                                                />
                                                            </Grid>
                                                            {
                                                                this.state.other_remark_check &&
                                                                <Grid item xs={12} lg={12} >
                                                                    {/* <Typography variant='h6' className="font-semibold"> Other Remarks :</Typography> */}
                                                                    <SubTitle title="Other Remarks :" />
                                                                    <TextValidator
                                                                        className=" w-full"
                                                                        placeholder="Enter Remarks"
                                                                        name="otherremark"
                                                                        InputLabelProps={{
                                                                            shrink: false
                                                                        }}
                                                                        value={this.state.other_remark}
                                                                        type="text"
                                                                        variant="outlined"
                                                                        size="small"

                                                                        onChange={(e) => {
                                                                            this.setState({
                                                                                other_remark: e.target.value

                                                                            })
                                                                        }} />
                                                                </Grid>
                                                            }
                                                            <Grid item lg={1} md={1} sm={12} xs={12} style={{ display: 'flex', alignItems: 'center' }}>
                                                                <Button
                                                                    className="mt-2"
                                                                    progress={false}
                                                                    type="submit"
                                                                    scrollToTop={true}
                                                                //onClick={this.handleChange}
                                                                >
                                                                    <span className="capitalize">Save</span>
                                                                </Button>
                                                            </Grid>
                                                        </Grid>
                                                    </ValidatorForm>
                                                </div>
                                                : null}
                                            {/* Content End */}

                                        </Fragment>

                                    )

                            }


                            {/* <AddPickUpPerson id={this.state.selectedOrder} ></AddPickUpPerson> */}
                        </div>
                    </Dialog>
                </Grid>
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
            </Fragment>


        )
    }
}

export default withStyles(styleSheet)(AllOrder_DeliveryDetails)
