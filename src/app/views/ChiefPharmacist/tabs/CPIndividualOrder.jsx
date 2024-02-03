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
import { dateParse } from 'utils'

class CPIndividualOrder extends Component {
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
                class_id: null,
                category_id: null,
                group_id: null,
                status: null,
                drug_store: null,
                search: null,
                order_exchange_id: this.props.match.params.id,
            },
            remarks: null,
            data: [],
            columns: [
                {
                    name: 'sr_no',
                    label: 'ST No',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.itemTable[tableMeta.rowIndex]
                                ?.ItemSnap?.sr_no
                        },
                    },
                },
                {
                    name: 'item_name',
                    label: 'Item Name',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.itemTable[tableMeta.rowIndex]
                                ?.ItemSnap.medium_description
                        },
                    },
                },
                {
                    name: 'dosage',
                    label: 'Dosage',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.itemTable[tableMeta.rowIndex]
                                ?.ItemSnap.strength
                        },
                    },
                },
                {
                    name: 'ordered_qty',
                    label: 'Ordered Qty',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.itemTable[tableMeta.rowIndex]
                                ?.request_quantity
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
                activity: 'ordered',
                date: '2022-07-02T22:11:38.000Z',
                status: 'APPROVED',
                remark_id: null,
                remark_by: null,
                type: 'APPROVED',
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


    componentDidMount() {
        this.loadData()
        this.LoadOrderItemDetails()
        this.LoadVehicleData()
        /* let status = this.props.match.params.status
        this.setState({ status }) */
    }

    async LoadOrderItemDetails() {
        this.setState({ loaded: false })
        let res = await PharmacyOrderService.getOrderItems(this.state.formData)
        if (res.status) {
            console.log('Order Item Data', res.data.view.data)
            this.setState(
                {
                    status: res?.data?.view?.data[0]?.OrderExchange?.status,
                    itemTable: res.data.view.data,
                    loaded: true,
                },
                () => {
                    this.render()
                    console.log('State ', this.state.itemTable)
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

        const user = await localStorageService.getItem('userInfo')
        this.state.approveOrder.remark_by = user.id
    }

    async approveOrder() {
        let approveOrder = this.state.approveOrder;
        approveOrder.date = dateParse(new Date())

        let approve = await ChiefPharmacistServices.approveOrder(approveOrder)
        if (approve.status == 201) {
            console.log(approve.data)
            if (approve.data.posted == 'data has been added successfully.') {
                this.setState({ alert: true, severity: 'success', message: "Order Status Changed" })
                window.location = '/chiefPharmacist/AllOders'
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
                                <Typography
                                    variant="h4"
                                    className="font-semibold"
                                >
                                    Individual Order
                                </Typography>
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
                                        Drug Store:{' '}
                                        {
                                            // this.state.loaded
                                            //     ? this.state.data.fromStore.name : ''
                                            'Pharmacy 1'
                                        }
                                    </Typography>
                                </Grid>
                                {/* <Grid item="item" lg={12} xs={12}>
                                    <Typography className="font-semibold">Pick-Up Person ID: {this.state.loaded ?this.state.data.Employee.id : ''}</Typography>
                                </Grid> */}
                                {/* <Grid item="item" lg={6} xs={12}>
                                    <Typography className="font-semibold">Name: {
                                            this.state.loaded
                                                ? this.state.data.Employee.name
                                                : ''
                                        }</Typography>
                                </Grid> */}
                                <Grid item="item" lg={6} xs={12}>
                                    <Typography className="font-semibold">
                                        Items:{' '}
                                        {this.state.loaded
                                            ? this.state.data.number_of_items
                                            : ''}
                                    </Typography>
                                </Grid>
                                <Grid item="item" lg={6} xs={12}>
                                    <Typography className="font-semibold">
                                        NA in Drug Store:
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
                                        ON GOING
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
                                            </Grid>
                                        </Grid>
                                        <Grid item="item" lg={4} md={4} xs={4}>
                                            <AccountCircleIcon fontSize="large" />
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
                                    className="w-full"
                                    options={this.state.all_item_class}
                                    onChange={(e, value) => {
                                        let formData = this.state.formData
                                        if (value != null) {
                                            formData.class_id = value.id
                                        } else {
                                            formData.class_id = null
                                        }

                                        this.setState({ formData })
                                    }}
                                    /*  defaultValue={this.state.all_district.find(
                                    (v) => v.id == this.state.formData.district_id
                                    )} */
                                    value={this.state.all_item_class.find(
                                        (v) =>
                                            v.id ==
                                            this.state.formData.class_id
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
                                    className="w-full"
                                    options={this.state.all_item_category}
                                    onChange={(e, value) => {
                                        let formData = this.state.formData
                                        if (value != null) {
                                            formData.category_id = value.id
                                        } else {
                                            formData.category_id = null
                                        }

                                        this.setState({ formData })
                                    }}
                                    /*  defaultValue={this.state.all_district.find(
                                    (v) => v.id == this.state.formData.district_id
                                    )} */
                                    value={this.state.all_item_category.find(
                                        (v) =>
                                            v.id ==
                                            this.state.formData.category_id
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
                                    className="w-full"
                                    options={this.state.all_item_group}
                                    onChange={(e, value) => {
                                        let formData = this.state.formData
                                        if (value != null) {
                                            formData.group_id = value.id
                                        } else {
                                            formData.group_id = null
                                        }

                                        this.setState({ formData })
                                    }}
                                    /*  defaultValue={this.state.all_district.find(
                                    (v) => v.id == this.state.formData.district_id
                                    )} */
                                    value={this.state.all_item_group.find(
                                        (v) =>
                                            v.id ==
                                            this.state.formData.group_id
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
                                                <IconButton onClick={() => { this.LoadOrderItemDetails() }}>
                                                    <SearchIcon />
                                                </IconButton>
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

                    {this.state.status == 'Pending' ||
                        this.state.status == 'Pending Approval' ||
                        this.state.status == 'Active' ||
                        this.state.status == 'ORDER' ? (
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
                                        value={this.state.remarks}
                                        type="text"
                                        multiline="multiline"
                                        rows={3}
                                        variant="outlined"
                                        size="small"
                                        onChange={(e) => {
                                            this.setState({
                                                remarks: e.target.value,
                                            })
                                        }}
                                        validators={['required']}
                                        errorMessages={[
                                            'this field is required',
                                        ]}
                                    />
                                </Grid>
                            </Grid>

                            <Grid container="container" spacing={2}>
                                <Grid item="item" lg={1} md={1} sm={12} xs={12}>
                                    <LoonsButton
                                        className="mt-2"
                                        progress={false}
                                        onClick={() => {
                                            this.approveOrder()
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
                                            let approveOrder =
                                                this.state.approveOrder
                                            approveOrder.status = 'REJECTED'
                                            approveOrder.type = 'REJECTED'
                                            //approveOrder.activity = "REJECTED"
                                            this.setState({ approveOrder })
                                            console.log(this.state.approveOrder)
                                            this.approveOrder()
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
export default CPIndividualOrder
