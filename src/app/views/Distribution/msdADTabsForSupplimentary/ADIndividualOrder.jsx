import {
    CircularProgress,
    Divider,
    Grid,
    Icon,
    IconButton,
    InputAdornment,
    Typography,
} from '@material-ui/core'
import {
    CardTitle,
    LoonsCard,
    LoonsSnackbar,
    LoonsTable,
    MainContainer,
    SubTitle,
} from 'app/components/LoonsLabComponents'
import React from 'react'
import { Component } from 'react'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import { Autocomplete } from '@material-ui/lab'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import LoonsButton from 'app/components/LoonsLabComponents/Button'
import SearchIcon from '@material-ui/icons/Search'
import ChiefPharmacistServices from 'app/services/ChiefPharmacistServices'
import PharmacyOrderService from 'app/services/PharmacyOrderService'
import WarehouseServices from 'app/services/WarehouseServices'
import CategoryService from 'app/services/datasetupServices/CategoryService'
import ClassDataSetupService from 'app/services/datasetupServices/ClassDataSetupService'
import GroupSetupService from 'app/services/datasetupServices/GroupSetupService'
import localStorageService from 'app/services/localStorageService'
import MDSService from 'app/services/MDSService'
import { convertTocommaSeparated, dateParse, roundDecimal } from 'utils'
import EstimationService from 'app/services/EstimationService'
import ClinicService from 'app/services/ClinicService'

class ADIndividualOrder extends Component {
    constructor(props) {
        super(props)
        this.state = {
            status: '',
            all_ven: [],
            all_item_class: [],
            all_item_category: [],
            all_item_group: [],
            all_drug_stores: [],
            all_status: [
                {
                    id: 1,
                    name: 'ALLOCATED',
                },
                {
                    id: 2,
                    name: 'APPROVED',
                },
                {
                    id: 3,
                    name: 'COMPLETED',
                },
                {
                    id: 4,
                    name: 'ISSUED',
                },
                {
                    id: 5,
                    name: 'ORDERED',
                },
                {
                    id: 6,
                    name: 'RECIEVED',
                },
                {
                    id: 7,
                    name: 'REJECTED',
                },
            ],
            formData: {
                ven_id: null,
                item_class_id: null,
                item_category: null,
                status: null,
                item_group: null,
                drug_store: null,
                search: null,
                order_exchange_id: this.props.match.params.id,
            },
            remarks: null,
            hospitalName: null,
            data: [],
            columns: [
                {
                    name: 'sr_no',
                    label: 'SR No',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.itemTable[tableMeta.rowIndex]
                                .ItemSnap.sr_no
                        },
                    },
                },
                {
                    name: 'item_name',
                    label: 'Item Name',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.itemTable[tableMeta.rowIndex].ItemSnap.medium_description

                        },
                    },
                },
                {
                    name: 'estimation',
                    label: 'Estimate',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return convertTocommaSeparated(this.state.itemTable[tableMeta.rowIndex].estimation?.estimation || 0, 2)
                        },
                    },
                },
                {
                    name: 'requested_ncrease',
                    label: 'Requested Increase',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // return this.state.itemTable[tableMeta.rowIndex].estimation?.estimation
                            console.log('valueeeeeeee', this.state.itemTable[tableMeta.rowIndex].estimation?.issued_quantity, this.state.itemTable[tableMeta.rowIndex].estimation?.allocated_quantity , this.state.itemTable[tableMeta.rowIndex].estimation?.estimation , this.state.itemTable[tableMeta.rowIndex].request_quantity )
                            let requestedIncrease = (Number(this.state.itemTable[tableMeta.rowIndex].estimation?.issued_quantity) + 
                                Number(this.state.itemTable[tableMeta.rowIndex].estimation?.allocated_quantity)) - 
                                Number(this.state.itemTable[tableMeta.rowIndex].estimation?.estimation) + 
                                Number(this.state.itemTable[tableMeta.rowIndex].request_quantity)

                                let output

                                if (requestedIncrease < 0) {
                                    output = Math.abs(requestedIncrease)
                                } else {
                                    output = requestedIncrease
                                }
                            return convertTocommaSeparated(output || 0, 2)
                        },
                    },
                },
                {
                    name: '',
                    label: 'Presantage % Increasement',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // return this.state.itemTable[tableMeta.rowIndex].ItemSnap.strength
                            let requestedIncrease = (Number(this.state.itemTable[tableMeta.rowIndex].estimation?.issued_quantity) + 
                            Number(this.state.itemTable[tableMeta.rowIndex].estimation?.allocated_quantity)) - 
                            Number(this.state.itemTable[tableMeta.rowIndex].estimation?.estimation) + 
                            Number(this.state.itemTable[tableMeta.rowIndex].request_quantity)

                                let returnValue

                                if (this.state.itemTable[tableMeta.rowIndex].estimation?.estimation > 0) {
                                   let  output = Number(requestedIncrease) / Number(this.state.itemTable[tableMeta.rowIndex].estimation?.estimation) * 100

                                    if (output < 0) {
                                        returnValue = Math.abs(output)
                                    } else {
                                        returnValue = output
                                    }

                                }

                                return convertTocommaSeparated(returnValue || 0,2)

                        },
                    },
                },
                {
                    name: 'dosage',
                    label: 'Dosage',
                    options: {
                        display: false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.itemTable[tableMeta.rowIndex]
                                .ItemSnap.strength
                        },
                    },
                },
                
                {
                    name: 'ordered_qty',
                    label: 'Ordered Qty',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log('cheking dta',this.state.itemTable[tableMeta.rowIndex] )
                            if (this.state.itemTable[tableMeta.rowIndex]?.ItemSnap?.converted_order_uom === "EUV2") { 
                                return roundDecimal(this.state.itemTable[tableMeta.rowIndex]?.request_quantity * this.state.itemTable[tableMeta.rowIndex]?.ItemSnap?.item_unit_size, 2) + ' ' + this.state.itemTable[tableMeta.rowIndex]?.ItemSnap?.DisplayUnit.name
                            } else {
                                return this.state.itemTable[tableMeta.rowIndex]?.request_quantity
                            }
                            
                        },
                    },
                },
                {
                    name: 'allocated_quantity',
                    label: 'Allocated Quantity',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if (this.state.itemTable[tableMeta.rowIndex]?.ItemSnap?.converted_order_uom === "EUV2") {
                                return roundDecimal(this.state.itemTable[tableMeta.rowIndex].allocated_quantity * this.state.itemTable[tableMeta.rowIndex]?.ItemSnap?.item_unit_size, 2) + ' ' + this.state.itemTable[tableMeta.rowIndex]?.ItemSnap?.DisplayUnit.name
                            } else {
                                return this.state.itemTable[tableMeta.rowIndex].allocated_quantity
                            }
                            
                        },
                    },
                },
                {
                    name: 'drugstore_qty',
                    label: 'Drug Store Qty',
                    options: {
                        display: false,
                        
                    },
                },
                {
                    name: 'remarks',
                    label: 'Remark',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'action',
                    label: 'Action',
                    options: {
                        display: false,
                    },
                },
            ],
            totalItems: null,
            loaded: false,
            itemTable: [],
            approveOrder: {
                order_exchange_id: this.props.match.params.id,
               
                other_remark: null,
                type: 'APPROVED_SUP',
            },
            vehicle_data: [],
            vehicle_columns: [
                {
                    name: 'Vehicle',
                    label: 'Hospital ID',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log('data', tableMeta);
                            return (tableMeta.rowData[tableMeta.columnIndex]?.owner_id)
                        }
                    }
                },
                {
                    name: 'Vehicle',
                    label: 'Vehicle Reg No',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log('data', tableMeta);
                            return (tableMeta.rowData[tableMeta.columnIndex]?.reg_no)
                        }
                    }
                },

                /*  {
                     name: 'ordered_qty',
                     label: 'Vehicle Type',
                     options: {
                         display: true,
                         // customBodyRender: (value, tableMeta, updateValue) => {
                         //     return this
                         //         .state
                         //         .itemTable[tableMeta.rowIndex]
                         //         .request_quantity
                         // }
                     }
                 }, */
                /* {
                    name: 'drugstore_qty',
                    label: 'Vehicle Storage Type',
                    options: {
                        display: true
                    }
                }, */
                {
                    name: 'Vehicle',
                    label: 'Max Volume',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log('data', tableMeta);
                            return (tableMeta.rowData[tableMeta.columnIndex]?.max_volume)
                        }
                    }
                },
                /*   {
                      name: 'drugstore_qty',
                      label: 'Reserved Capacity',
                      options: {
                          display: true
                      }
                  }, */
                {
                    name: 'Vehicle',
                    label: 'Status',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log('data', tableMeta);
                            return (tableMeta.rowData[tableMeta.columnIndex]?.status)
                        }
                    }
                },
                /*  {
                     name: 'drugstore_qty',
                     label: 'Reserved Date',
                     options: {
                         display: true
                     }
                 }, */
                /*   {
                      name: 'drugstore_qty',
                      label: 'Time',
                      options: {
                          display: true
                      }
                  }, */

            ],
            vehicle_filterData: {
                page: 0,
                limit: 10,
                //order_delivery_id: null,
                order_delivery_id: null,
                order_exchange_id: this.props.match.params.id,
                "order[0][0]": 'updatedAt',
                "order[0][1]": 'Desc'
            },


        }
    }
    async LoadVehicleData() {
        this.setState({
            vehicleLoaded: false
        })
        let res = await MDSService.getAllOrderVehicles(this.state.vehicle_filterData)
        if (res.status && res.status == 200) {
            this.setState({
                vehicle_data: res.data.view.data,
                vehicleLoaded: true
            }, () => console.log('resdata', this.state.vehicle_data))
        }
    }

    async getEstimationDetails(val){

        console.log('dadasdasdadsads', val)

        let selected_item_owner_id = val.map((el) => el.OrderExchange?.fromStore?.owner_id)
        let selected_item_id = val.map((el) => el.item_id)

        const currentDate = new Date();
        const startingDate = new Date(currentDate.getFullYear(), 0, 1);
        const lastDate = new Date(currentDate.getFullYear(), 11, 31);

        let params = {
            //warehouse_id: data[0].OrderExchange.from,
            owner_id: selected_item_owner_id,
            item_id: selected_item_id,
            estimation_status: 'Active',
            available_estimation: 'Active',
            status: 'Active',
            hospital_estimation_status: 'Active',
            // 'order[0]': ['createdAt', 'DESC'],
            from: dateParse(startingDate),
            to: dateParse(lastDate),
            'order[0]': ['estimation', 'DESC'],
        }

       let res = await EstimationService.getAllEstimationITEMS(params)


       let updatedArray = []
        if(res.status === 200) {
            console.log('checked estimation', res)

            updatedArray = val.map((obj1) => {
                const obj2 = res.data.view.data.find((obj) => obj.item_id === obj1.item_id);

                obj1.estimation = obj2
                
                return obj1;
            });
        }

        this.setState(
            {
                itemTable: updatedArray,
            },
            () => {
                this.render()
            }
        )

        console.log('asdasdasdasdaadsadasdadasd', this.state.itemTable)
    }


    componentDidMount() {
        this.loadData()
        this.LoadOrderItemDetails()
        this.LoadVehicleData()
        let status = this.props.match.params.status
        this.setState({ status })
    }

    async LoadOrderItemDetails() {
        this.setState({ loaded: false })
        let res = await PharmacyOrderService.getOrderItems(this.state.formData)
        if (res.status) {
            console.log('Order Item Data', res.data.view.data)
            this.setState(
                {
                    // itemTable: res.data.view.data,
                    loaded: true,
                },
                () => {
                    this.render()
                    console.log('State ', this.state.itemTable)
                    this.getEstimationDetails(res.data.view.data)
                }
            )
        }
    }

    async loadData() {
        let orders = await ChiefPharmacistServices.getSingleOrder(
            { limit: 99999 },
            this.props.match.params.id
        )
        if (orders.status == 200) {
            console.log('Order Details', orders.data.view)
            this.setState({ data: orders.data.view })
            this.getHospitalDetails(orders.data.view.from_owner_id)
        }

        let ven_res = await WarehouseServices.getVEN({ limit: 99999 })
        if (ven_res.status == 200) {
            console.log('Ven', ven_res.data.view.data)
            this.setState({ all_ven: ven_res.data.view.data })
        }
        let cat_res = await CategoryService.fetchAllCategories({ limit: 99999 })
        if (cat_res.status == 200) {
            console.log('Categories', cat_res.data.view.data)
            this.setState({ all_item_category: cat_res.data.view.data })
        }
        let class_res = await ClassDataSetupService.fetchAllClass({
            limit: 99999,
        })
        if (class_res.status == 200) {
            console.log('Classes', class_res.data.view.data)
            this.setState({ all_item_class: class_res.data.view.data })
        }
        let group_res = await GroupSetupService.fetchAllGroup({ limit: 99999 })
        if (group_res.status == 200) {
            console.log('Groups', group_res.data.view.data)
            this.setState({ all_item_group: group_res.data.view.data })
        }

        let warehouses = await WarehouseServices.getWarehoure()
        if (warehouses.status == 200) {
            console.log('Warehouses', warehouses.data.view.data)
            this.setState({ all_drug_stores: warehouses.data.view.data })
        }


    }

    async getHospitalDetails(e){

        let formOwnID = e
        

        let params = {
            issuance_type: ["Hospital", "RMSD Main"],
            // limit: 1, 
            // page: 0,
            'order[0]': ['createdAt', 'ASC'],
            selected_owner_id: formOwnID
        };


        let res = await ClinicService.fetchAllClinicsNew(params, null);

        if (res.status === 200) {
            console.log('my checked datat',res.data.view.data?.[0])

            this.setState({
                hospitalName: res.data.view.data?.[0]
                
            })
        }
    }

    async approveOrder(type) {
        let approveOrder = this.state.approveOrder;

        const user = await localStorageService.getItem('userInfo')
        approveOrder.created_by = user.id
        approveOrder.date = dateParse(new Date())
        approveOrder.type = type

        let approve = await ChiefPharmacistServices.approveOrder(approveOrder)
        if (approve.status == 201) {
            console.log(approve.data)
            if (approve.data.posted == 'data has been added successfully.') {
                this.setState({ alert: true, severity: 'success', message: "Order Status Changed" })
                window.location = '/distribution/msdad/supplementary-orders'
            } else {
                this.setState({ alert: true, severity: 'error', message: "Order Status Cannot Changed" })
            }
        }
    }

    render() {
        return (
            <MainContainer>
                <LoonsCard>
                    <Grid container="container" lg={12} md={12}>
                        <Grid item="item" lg={7} md={7} xs={7}>
                            <Grid itemm="itemm" xs={12}>
                                <div className='flex'>
                                    <Typography variant="h6" className="font-semibold" >Individual Order </Typography>
                                    <Typography variant="h6" className="font-semibold" style={{ color: this.state.data?.special_normal_type == "SUPPLEMENTARY" ? "red" : "green" }}> ({this.state.data?.special_normal_type})</Typography>
                                    <Typography variant="h6" className="font-semibold" > - {this.state.data?.approval_status}</Typography>

                                </div>
                            </Grid>
                            <div
                                style={
                                    {
                                        // display: 'flex'
                                    }
                                }
                            >
                                <Grid item="item" lg={12} xs={12}>
                                    <Typography className="font-semibold">
                                        Order ID :{' '}
                                        {this.state.loaded
                                            ? this.state.data.order_id
                                            : ''}
                                    </Typography>
                                </Grid>


                                <Grid item="item" lg={6} xs={12}>
                                    <Typography className="font-semibold">
                                        Items:{' '}
                                        {this.state.loaded
                                            ? this.state.data.number_of_items
                                            : ''}
                                    </Typography>
                                </Grid>

                            </div>
                        </Grid>
                        <Grid item="item" lg={5} md={5} xs={5}>
                            <Grid container="container" lg={12} md={12} xs={12}>
                                <Grid item="item" lg={12} md={12} xs={12}>
                                    <Typography
                                        variant="h6"
                                        className="font-semibold text-center"
                                    >
                                        {this.state.data?.status}
                                    </Typography>
                                </Grid>
                                <Grid item="item" lg={12} md={12} xs={12}>
                                    <Grid
                                        container="container"
                                        style={{
                                            alignItems: 'flex-end',
                                        }}
                                    >
                                        <Grid item="item" lg={8} md={8} xs={8}>
                                            <Grid
                                                container="container"
                                                lg={12}
                                                md={12}
                                                xs={12}
                                            >
                                                {/* <Grid item="item" lg={6} md={6} xs={6}>Counter Pharmacist ID :</Grid>
                                                <Grid item="item" lg={6} md={6} xs={6}>00002</Grid> */}
                                                <Grid
                                                    item="item"
                                                    lg={6}
                                                    md={6}
                                                    xs={6}
                                                >
                                                    Counter Pharmacist :{' '}
                                                </Grid>
                                                <Grid
                                                    item="item"
                                                    lg={6}
                                                    md={6}
                                                    xs={6}
                                                >
                                                    <Typography className="font-semibold">
                                                        {this.state.loaded &&
                                                            this.state.data
                                                                .length != 0
                                                            ? this.state.data
                                                                .Employee.name
                                                            : ''}
                                                    </Typography>
                                                </Grid>
                                                <Grid
                                                    item="item"
                                                    lg={6}
                                                    md={6}
                                                    xs={6}
                                                >
                                                    Name of the hospital :{' '}
                                                </Grid>
                                                <Grid
                                                    item="item"
                                                    lg={6}
                                                    md={6}
                                                    xs={6}
                                                >
                                                    <Typography className="font-semibold">
                                                        {this.state.hospitalName?.name ? this.state.hospitalName?.name + ' (' + this.state.hospitalName?.Department?.name + ')'  : ' '}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </Grid>

                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Divider className="mb-4"></Divider>
                    <Grid container="container" spacing={2}>
                        <Grid item="item" xs={12}>
                            <Typography variant="h5" className="font-semibold">
                                Filters
                            </Typography>
                            <Divider></Divider>
                        </Grid>
                    </Grid>
                    <ValidatorForm
                        onSubmit={() => this.LoadOrderItemDetails()}
                        onError={() => null}
                    >
                        <Grid container="container" spacing={2}>
                            <Grid item="item" xs={12} sm={12} md={3} lg={3}>
                                <SubTitle title="Ven" />
                                <Autocomplete
                                        disableClearable
                                    className="w-full"
                                    options={this.state.all_ven}
                                    onChange={(e, value) => {
                                        let formData = this.state.formData
                                        if (value != null) {
                                            formData.ven_id = value.id
                                        } else {
                                            formData.ven_id = null
                                        }

                                        this.setState({ formData })
                                    }}
                                    /*  defaultValue={this.state.all_district.find(
                                    (v) => v.id == this.state.formData.district_id
                                    )} */
                                    value={this.state.all_ven.find(
                                        (v) =>
                                            v.id == this.state.formData.ven_id
                                    )}
                                    getOptionLabel={(option) =>
                                        option.name ? option.name : ''
                                    }
                                    renderInput={(params) => (
                                        <TextValidator
                                            {...params}
                                            placeholder="Ven"
                                            //variant="outlined"
                                            fullWidth="fullWidth"
                                            variant="outlined"
                                            size="small"
                                        />
                                    )}
                                />
                            </Grid>

                            {/* Serial/Family Number */}
                            <Grid
                                className=" w-full"
                                item="item"
                                lg={3}
                                md={3}
                                sm={12}
                                xs={12}
                            >
                                <SubTitle title="Item Class" />
                                <Autocomplete
                                        disableClearable
                                    className="w-full"
                                    options={this.state.all_item_class}
                                    onChange={(e, value) => {
                                        let formData = this.state.formData
                                        if (value != null) {
                                            formData.item_class_id = value.id
                                        } else {
                                            formData.item_class_id = null
                                        }

                                        this.setState({ formData })
                                    }}
                                    /*  defaultValue={this.state.all_district.find(
                                    (v) => v.id == this.state.formData.district_id
                                    )} */
                                    value={this.state.all_item_class.find(
                                        (v) =>
                                            v.id ==
                                            this.state.formData.item_class_id
                                    )}
                                    getOptionLabel={(option) =>
                                        option.description
                                            ? option.description
                                            : ''
                                    }
                                    renderInput={(params) => (
                                        <TextValidator
                                            {...params}
                                            placeholder="Item Class"
                                            //variant="outlined"
                                            fullWidth="fullWidth"
                                            variant="outlined"
                                            size="small"
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid
                                className=" w-full"
                                item="item"
                                lg={3}
                                md={3}
                                sm={12}
                                xs={12}
                            >
                                <SubTitle title="Item Category" />
                                <Autocomplete
                                        disableClearable
                                    className="w-full"
                                    options={this.state.all_item_category}
                                    onChange={(e, value) => {
                                        let formData = this.state.formData
                                        if (value != null) {
                                            formData.item_category = value.id
                                        } else {
                                            formData.item_category = null
                                        }

                                        this.setState({ formData })
                                    }}
                                    /*  defaultValue={this.state.all_district.find(
                                    (v) => v.id == this.state.formData.district_id
                                    )} */
                                    value={this.state.all_item_category.find(
                                        (v) =>
                                            v.id ==
                                            this.state.formData
                                                .all_item_category
                                    )}
                                    getOptionLabel={(option) =>
                                        option.description
                                            ? option.description
                                            : ''
                                    }
                                    renderInput={(params) => (
                                        <TextValidator
                                            {...params}
                                            placeholder="Item Category"
                                            //variant="outlined"
                                            fullWidth="fullWidth"
                                            variant="outlined"
                                            size="small"
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid
                                className=" w-full"
                                item="item"
                                lg={3}
                                md={3}
                                sm={12}
                                xs={12}
                            >
                                <SubTitle title="Status" />
                                <Autocomplete
                                        disableClearable
                                    className="w-full"
                                    options={this.state.all_status}
                                    onChange={(e, value) => {
                                        let formData = this.state.formData
                                        if (value != null) {
                                            formData.status = value.name
                                        } else {
                                            formData.status = null
                                        }

                                        this.setState({ formData })
                                    }}
                                    /*  defaultValue={this.state.all_district.find(
                                    (v) => v.id == this.state.formData.district_id
                                    )} */
                                    value={this.state.all_status.find(
                                        (v) =>
                                            v.id == this.state.formData.status
                                    )}
                                    getOptionLabel={(option) =>
                                        option.name ? option.name : ''
                                    }
                                    renderInput={(params) => (
                                        <TextValidator
                                            {...params}
                                            placeholder="Status"
                                            //variant="outlined"
                                            fullWidth="fullWidth"
                                            variant="outlined"
                                            size="small"
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid
                                className=" w-full"
                                item="item"
                                lg={3}
                                md={3}
                                sm={12}
                                xs={12}
                            >
                                <SubTitle title="Item Group" />
                                <Autocomplete
                                        disableClearable
                                    className="w-full"
                                    options={this.state.all_item_group}
                                    onChange={(e, value) => {
                                        let formData = this.state.formData
                                        if (value != null) {
                                            formData.item_group = value.id
                                        } else {
                                            formData.item_group = null
                                        }

                                        this.setState({ formData })
                                    }}
                                    /*  defaultValue={this.state.all_district.find(
                                    (v) => v.id == this.state.formData.district_id
                                    )} */
                                    value={this.state.all_item_group.find(
                                        (v) =>
                                            v.id ==
                                            this.state.formData.item_group
                                    )}
                                    getOptionLabel={(option) =>
                                        option.description
                                            ? option.description
                                            : ''
                                    }
                                    renderInput={(params) => (
                                        <TextValidator
                                            {...params}
                                            placeholder="Item Group"
                                            //variant="outlined"
                                            fullWidth="fullWidth"
                                            variant="outlined"
                                            size="small"
                                        />
                                    )}
                                />
                            </Grid>
                            {/* <Grid className=" w-full" item="item" lg={3} md={3} sm={12} xs={12}>
                                <SubTitle title="Drug Store"/>
                                <Autocomplete
                                        disableClearable className="w-full" options={this.state.all_drug_stores} onChange={(e, value) => {
                                        let formData = this.state.formData
                                        if (value != null) {                                           
                                            formData.drug_store = value.id                                           
                                        }else{
                                            formData.drug_store = null
                                        }

                                        this.setState({formData})
                                    }}
                                   
                                    value={this
                                        .state
                                        .all_drug_stores
                                        .find((v) => v.id == this.state.formData.drug_store)} getOptionLabel={(
                                        option) => option.name
                                        ? option.name
                                        : ''} renderInput={(params) => (
                                        <TextValidator {...params} placeholder="Drug Store"
                                            //variant="outlined"
                                            fullWidth="fullWidth" variant="outlined" size="small"/>
                                    )}/>
                            </Grid> */}
                            <Grid
                                item="item"
                                lg={1}
                                md={1}
                                sm={12}
                                xs={12}
                                style={{
                                    display: 'flex',
                                    alignItems: 'flex-end',
                                }}
                            >
                                <LoonsButton
                                    className="mt-2"
                                    progress={false}
                                    type="submit"
                                    scrollToTop={true}
                                //onClick={this.handleChange}
                                >
                                    <span className="capitalize">Filter</span>
                                </LoonsButton>
                            </Grid>
                            <Grid item="item" lg={12} md={12} xs={12}></Grid>
                            <Grid
                                item="item"
                                lg={3}
                                md={3}
                                xs={3}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    marginTop: '-20px',
                                }}
                            >
                                <SubTitle title="Search" />
                                <TextValidator
                                    className="w-full"
                                    placeholder="Search"
                                    fullWidth="fullWidth"
                                    variant="outlined"
                                    size="small"
                                    //value={this.state.formData.search}
                                    onChange={(e, value) => {
                                        let formData = this.state.formData
                                        if (e.target.value != '') {
                                            formData.search = e.target.value
                                        } else {
                                            formData.search = null
                                        }
                                        this.setState({ formData })
                                        console.log(
                                            'form dat',
                                            this.state.formData
                                        )
                                    }}
                                    onKeyPress={(e) => {
                                        if (e.key == 'Enter') {
                                            this.LoadOrderItemDetails()
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
                                        ),
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </ValidatorForm>
                    <Grid container="container" className="mt-2 pb-5">
                        <Grid item="item" lg={12} md={12} sm={12} xs={12}>
                            {this.state.loaded ? (
                                <LoonsTable
                                    //title={"All Aptitute Tests"}
                                    id={'all_items'}
                                    data={this.state.itemTable}
                                    columns={this.state.columns}
                                    options={{
                                        pagination: true,
                                        serverSide: true,
                                        count: this.state.totalItems,
                                        rowsPerPage: 20,
                                        // page: this.state.formData.page,
                                        print: true,
                                        viewColumns: true,
                                        download: true,
                                        onTableChange: (action, tableState) => {
                                            console.log(action, tableState)
                                            switch (action) {
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
                            ) : (
                                //loading effect
                                <Grid className="justify-center text-center w-full pt-12">
                                    <CircularProgress size={30} />
                                </Grid>
                            )}
                        </Grid>
                    </Grid>
                    <Grid className='mt-5' item lg={12} md={12} sm={12} xs={12}>
                        {
                            this.state.vehicleLoaded ?
                                <>
                                    <LoonsTable
                                        title={"Assigned Vehicles"}

                                        id={'all_vehicle'}
                                        data={
                                            this.state.vehicle_data
                                        }
                                        columns={
                                            this.state.vehicle_columns
                                        }
                                        options={{
                                            pagination: false,
                                            serverSide: true,
                                            //count: this.state.totalItems,
                                            //rowsPerPage: this.state.filterData.limit,
                                            //page: this.state.filterData.page,

                                            print: false,
                                            viewColumns: false,
                                            download: false,
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
                                </> :
                                (
                                    //loading effect
                                    <Grid className="justify-center text-center w-full pt-12">
                                        <CircularProgress size={30} />
                                    </Grid>
                                )

                        }

                    </Grid>
                    {/* <Dialog  fullWidth maxWidth="xl" open={this.state.vehicleDialogView} 
                onClose={() => { this.setState({ vehicleDialogView: false }, () => this.preLoadData()) }}  >
                    <MuiDialogTitle disableTypography
                    //  className={classes.Dialogroot}
                     >
                        <CardTitle title="Select New Vehicle" />
                        <IconButton aria-label="close"
                        //  className={classes.closeButton}
                            onClick={() => {
                                this.setState({ vehicleDialogView: false }, () => this.preLoadData())
                             }}>
                            <CloseIcon />
                         </IconButton> 
                    </MuiDialogTitle>
                    <div className="w-full h-full px-5 py-5">
                        <MDS_AddVehicleNew delivery_id={this.state.vehicle_filterData.order_delivery_id} />
                    </div>
                </Dialog>
 */}

                    {this.state.data?.approval_status == 'PENDING' ? (
                        <ValidatorForm>
                            <Grid container="container" spacing={2}>
                                <Grid item="item" lg={6} xs={12}>
                                    <SubTitle title="Remark" />
                                    <TextValidator
                                        className="w-full"
                                        placeholder="Remarks"
                                        name="Remarks"
                                        InputLabelProps={{
                                            shrink: false,
                                        }}
                                        value={this.state.approveOrder.other_remark}
                                        type="text"
                                        multiline="multiline"
                                        rows={3}
                                        variant="outlined"
                                        size="small"
                                        onChange={(e) => {
                                            let approveOrder = this.state.approveOrder
                                            approveOrder.other_remark = e.target.value
                                            this.setState({ approveOrder })
                                        }}
                                       /*  validators={['required']}
                                        errorMessages={[
                                            'this field is required',
                                        ]} */
                                    />
                                </Grid>
                            </Grid>

                            <Grid container="container" spacing={2}>
                                <Grid item="item" lg={1} md={1} sm={12} xs={12}>
                                    <LoonsButton
                                        className="mt-2"
                                        progress={false}
                                        onClick={() => {
                                            this.approveOrder("APPROVED_SUP")
                                        }}
                                    >
                                        <span className="capitalize">
                                            Approve
                                        </span>
                                    </LoonsButton>
                                </Grid>
                                <Grid item="item" lg={1} md={1} sm={12} xs={12}>
                                    <LoonsButton
                                        className="mt-2"
                                        progress={false}
                                        onClick={() => {
                                            this.approveOrder("REJECTED_SUP")
                                        }}
                                    >
                                        <span className="capitalize">
                                            Reject
                                        </span>
                                    </LoonsButton>
                                </Grid>
                            </Grid>
                        </ValidatorForm>
                    ) : null}
                </LoonsCard>
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
        )
    }
}
export default ADIndividualOrder
