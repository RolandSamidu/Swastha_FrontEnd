import {
    CircularProgress,
    Dialog,
    Divider,
    Grid,
    Icon,
    IconButton,
    InputAdornment,
    Typography,
} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import {
    CardTitle,
    LoonsCard,
    LoonsTable,
    MainContainer,
    SubTitle,
} from 'app/components/LoonsLabComponents'
import LoonsButton from 'app/components/LoonsLabComponents/Button'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import LoonsDatePicker from 'app/components/LoonsLabComponents/DatePicker'
import React, { Component } from 'react'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import PharmacyCards from './components/PharmacyCards'
import SearchIcon from '@material-ui/icons/Search'
import ChiefPharmacistServices from 'app/services/ChiefPharmacistServices'
import { dateTimeParse } from 'utils'
import WarehouseServices from 'app/services/WarehouseServices'
import localStorageService from 'app/services/localStorageService'
import ApartmentIcon from '@material-ui/icons/Apartment'

class CPAllOrderss extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dialog_for_select_warehouse: false,
            all_warehouse_loaded: [],
            date_selection: true,
            cards: [],
            sorted_Cards: [],
            all_status: [
                {
                    id: 0,
                    name: 'Pending Approval',
                },
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
            all_drug_stores: [],
            all_pharmacy: [],
            all_date_range: [],
            data: [],
            columns: [
                {
                    name: 'pharmacy',
                    label: 'Request From',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if (this.state.data) {
                                return this.state.data[tableMeta.rowIndex]
                                    .fromStore.name
                            } else {
                                return 'N/A'
                            }
                        },
                    },
                },
                {
                    name: 'createdAt',
                    label: 'Request Date',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].createdAt
                            return <p>{dateTimeParse(data)}</p>
                        },
                    },
                },
                {
                    name: 'pharmacist_name',
                    label: 'Request By',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.data[tableMeta.rowIndex].Employee
                                .name
                        },
                    },
                },
                {
                    name: 'pharmacy',
                    label: 'Request To',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if (this.state.data) {
                                return this.state.data[tableMeta.rowIndex]
                                    .toStore.name
                            } else {
                                return 'N/A'
                            }
                        },
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
                    name: 'required_date',
                    label: 'Required Date',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].required_date
                            return <p>{dateTimeParse(data)}</p>
                        },
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
                    name: 'action',
                    label: 'Action',
                    options: {
                        // filter: true,
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <>
                                    {' '}
                                    <IconButton
                                        className="text-black"
                                        onClick={() => {
                                            window.location = `/chiefPharmacist/individualOrder/${
                                                this.state.data[
                                                    tableMeta.rowIndex
                                                ].id
                                            }/${
                                                this.state.data[
                                                    tableMeta.rowIndex
                                                ].status
                                            }`
                                        }}
                                    >
                                        {' '}
                                        <Icon color="primary">visibility</Icon>
                                    </IconButton>
                                </>
                            )
                        },
                    },
                },
            ],
            loaded: false,
            filterData: {
                limit: 20,
                page: 0,
                owner_id: null,
                'order[0]': ['updatedAt', 'DESC'],
                type: 'Order',
                pharmacy: null,
                from: null,
                to: null,
                from_date: null,
                to_date: null,
                status: null,
                date_type: null,
                search: null,
            },
            totalItems: 0,
            selected_warehouse: null,
            owner_id: null,
            from_drugstore: [],
            to_drugstore: [],
        }
    }

    async loadWarehouses() {
        var user = await localStorageService.getItem('userInfo')
        console.log('user', user)

        var id = user.id
        var all_pharmacy_dummy = []

        var selected_warehouse_cache = await localStorageService.getItem(
            'Selected_Warehouse'
        )

        let owner_id = await localStorageService.getItem('owner_id')

        this.setState({ owner_id: owner_id })

        /*    if (!selected_warehouse_cache) {
               //this.setState({dialog_for_select_warehouse: true})
           } else {
               this.state.filterData.owner_id = selected_warehouse_cache
                   .owner_id
               //this.state.filterData.from = selected_warehouse_cache.id
               this
                   .setState(
                       { owner_id: selected_warehouse_cache.owner_id, selected_warehouse: selected_warehouse_cache.id, dialog_for_select_warehouse: false }
                   )
               //this.state.filterData.to = this.state.selected_warehouse
               console.log(this.state.selected_warehouse)
           } */

        let params = {
            employee_id: id,
        }
        let res = await WarehouseServices.getWareHouseUsers(params)
        if (res.status == 200) {
            console.log('warehouseUsers', res.data.view.data)

            res.data.view.data.forEach((element) => {
                all_pharmacy_dummy.push({
                    warehouse: element.Warehouse,
                    name: element.Warehouse.name,
                    main_or_personal: element.Warehouse.main_or_personal,
                    owner_id: element.Warehouse.owner_id,
                    id: element.warehouse_id,
                    pharmacy_drugs_stores_id:
                        element.Warehouse.pharmacy_drugs_store_id,
                })
            })

            console.log('warehouse', all_pharmacy_dummy)
            this.setState({ all_warehouse_loaded: all_pharmacy_dummy })
        }
    }

    componentDidMount() {
        this.loadWarehouses()
        this.loadData()
    }

    async loadData() {
        this.setState({ loaded: false })
        let filterData = this.state.filterData
        let owner_id = await localStorageService.getItem('owner_id')
        filterData.owner_id = owner_id
        this.setState({ filterData })

        let orders = await ChiefPharmacistServices.getAllOrders(filterData)
        if (orders.status == 200) {
            console.log('Orders', orders.data.view.data)
            this.setState({
                data: orders.data.view.data,
                totalItems: orders.data.view.totalItems,
            })
        }

        let cards = await ChiefPharmacistServices.getCards(
            { type: 'Order', owner_id: owner_id },
            0
        )
        if (cards.status == 200) {
            console.log('cards', cards.data.view.data)
            this.setState({ cards: cards.data.view.data })
        }

        if (this.state.sorted_Cards.length == 0) {
            this.array_sort()
        }

        this.setState({ loaded: true })

        let params = {}
        let warehouses = await WarehouseServices.getAllWarehousewithOwner(
            params,
            null
        )
        if (warehouses.status == 200) {
            console.log('Warehouses', warehouses.data.view.data)

            let from_drugstore = warehouses.data.view.data.filter(
                (x) => x.owner_id == owner_id
            )
            console.log('Warehouses from', from_drugstore)

            let to_drugstore = warehouses.data.view.data.filter(
                (x) =>
                    x.Pharmacy_drugs_store.issuance_type == 'Main' ||
                    x.Pharmacy_drugs_store.issuance_type == 'drug_store'
            )
            console.log('Warehouses to', to_drugstore)

            this.setState({
                all_pharmacy: warehouses.data.view.data,
                from_drugstore,
                to_drugstore,
            })
        }
    }

    async setPage(page) {
        //Change paginations
        let filterData = this.state.filterData
        filterData.page = page
        this.setState(
            {
                filterData,
            },
            () => {
                this.loadData()
            }
        )
    }

    array_sort() {
        let testArray = this.state.cards.filter(
            (value, index, self) =>
                index === self.findIndex((t) => t.from === value.from)
        )

        testArray.filter((value, index, self) => {
            let localArray = []
            this.state.cards.map((card) => {
                if (card.from == value.from) {
                    localArray.push({
                        status: card.status,
                        total: card.total_count,
                    })
                }
            })

            this.state.sorted_Cards.push({
                name: value.name,
                id: value.from,
                statuses: localArray,
            })
        })
    }

    render() {
        return (
            <MainContainer>
              <LoonsCard>
                <Grid container="container" spacing={2}>
                    <Grid
                        item="item"
                        xs={12}
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Typography variant="h5" className="font-semibold">
                            All Orders
                        </Typography>
                        {/* <div>
                        <LoonsButton
                            color='primary'
                            onClick={() => {
                                this.setState({dialog_for_select_warehouse: true})
                            }}>
                            <ApartmentIcon/>
                            Chanage Warehouse
                        </LoonsButton>
                    </div> */}
                    </Grid>
                    <Grid item="item" lg={12} md={12} xs={12}>
                        <Divider />
                    </Grid>
                </Grid>
                {this.state.loaded ? (
                    <div className='w-full'
                        style={{
                            overflowX: 'scroll',
                            display: 'inline-flex',
                            flexWrap: 'nowrap',
                            width: '90vw',
                            justifyContent: 'space-between'
                        }}
                    >
                        {this.state.sorted_Cards.map((value, index) => (
                            <div>
                                {value.statuses.length != 0 ? (
                                    <PharmacyCards data={value} />
                                ) : null}
                            </div>
                        ))}
                    </div>
                ) : (
                    'No card data'
                )}

                <Grid container="container" spacing={2} className="mt-10">
                    <Grid item="item" xs={12}>
                        <Typography variant="h5" className="font-semibold">
                            Filters
                        </Typography>
                        <Divider></Divider>
                    </Grid>
                </Grid>
                <ValidatorForm
                    onSubmit={() => {
                        let filterData = this.state.filterData
                        filterData.page = 0
                        this.setState({ filterData })
                        this.loadData()
                    }}
                    onError={() => null}
                >
                    <Grid container="container" spacing={2}>
                        <Grid item="item" lg={4} md={4} sm={12} xs={12}>
                            <SubTitle title="Status" />
                            <Autocomplete
                                        disableClearable
                                className="w-full"
                                options={this.state.all_status}
                                onChange={(e, value) => {
                                    if (value != null) {
                                        let filterData = this.state.filterData
                                        filterData.status = value.name
                                        this.setState({ filterData })
                                    }
                                }}
                                /*  defaultValue={this.state.all_district.find(
                            (v) => v.id == this.state.formData.district_id
                            )} */
                                value={this.state.all_status.find(
                                    (v) => v.id == this.state.filterData.status
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
                        <Grid item="item" lg={4} md={4} sm={12} xs={12}>
                            <SubTitle title="Request From" />
                            <Autocomplete
                                        disableClearable
                                className="w-full"
                                options={this.state.from_drugstore}
                                onChange={(e, value) => {
                                    let filterData = this.state.filterData
                                    if (value != null) {
                                        filterData.from = value.id
                                    } else {
                                        filterData.from = null
                                    }
                                    this.setState({ filterData })
                                }}
                                /*  defaultValue={this.state.all_district.find(
                            (v) => v.id == this.state.formData.district_id
                            )} */
                                value={this.state.all_pharmacy.find(
                                    (v) =>
                                        v.id ==
                                        this.state.filterData.all_pharmacy
                                )}
                                getOptionLabel={(option) =>
                                    option.name ? option.name : ''
                                }
                                renderInput={(params) => (
                                    <TextValidator
                                        {...params}
                                        placeholder="Request From"
                                        //variant="outlined"
                                        fullWidth="fullWidth"
                                        variant="outlined"
                                        size="small"
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item="item" lg={4} md={4} sm={12} xs={12}>
                            <SubTitle title="Request to" />
                            <Autocomplete
                                        disableClearable
                                className="w-full"
                                options={this.state.to_drugstore}
                                onChange={(e, value) => {
                                    let filterData = this.state.filterData
                                    if (value != null) {
                                        filterData.to = value.id
                                    } else {
                                        filterData.to = null
                                    }
                                    this.setState({ filterData })
                                }}
                                /*  defaultValue={this.state.all_district.find(
                            (v) => v.id == this.state.formData.district_id
                            )} */
                                value={this.state.all_pharmacy.find(
                                    (v) => v.id == this.state.all_pharmacy
                                )}
                                getOptionLabel={(option) =>
                                    option.name ? option.name : ''
                                }
                                renderInput={(params) => (
                                    <TextValidator
                                        {...params}
                                        placeholder="Request to"
                                        //variant="outlined"
                                        fullWidth="fullWidth"
                                        variant="outlined"
                                        size="small"
                                    />
                                )}
                            />
                        </Grid>

                        <Grid
                            item="item"
                            lg={4}
                            md={4}
                            sm={4}
                            xs={4}
                            className="px-2"
                        >
                            <SubTitle title={'Date Range'}></SubTitle>
                            <Autocomplete
                                        disableClearable
                                className="w-full"
                                options={[
                                    {
                                        label: 'Requested Date',
                                        value: 'REQUESTED DATE',
                                    },
                                    {
                                        label: 'Required Date',
                                        value: 'REQUIRED DATE',
                                    },
                                    {
                                        label: 'Allocated Date',
                                        value: 'ALLOCATED DATE',
                                    },
                                    {
                                        label: 'Issued Date',
                                        value: 'ISSUED DATE',
                                    },
                                    {
                                        label: 'Received Date',
                                        value: 'RECEIVED DATE',
                                    },
                                ]}
                                /*  defaultValue={dummy.find(
                            (v) => v.value == ''
                            )} */
                                getOptionLabel={(option) => option.label}
                                getOptionSelected={(option, value) =>
                                    console.log('ok')
                                }
                                onChange={(event, value) => {
                                    let filterData = this.state.filterData
                                    if (value != null) {
                                        filterData.date_type = value.value
                                        this.setState({ date_selection: false })
                                    } else {
                                        filterData.date_type = null
                                        filterData.to_date = null
                                        filterData.from_date = null
                                        this.setState({ date_selection: true })
                                    }
                                    this.setState({ filterData })
                                }}
                                renderInput={(params) => (
                                    <TextValidator
                                        {...params}
                                        placeholder="Date Range"
                                        //variant="outlined"

                                        //value={}
                                        fullWidth="fullWidth"
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
                                    />
                                )}
                            />
                            {/* {
                                this.state.filterDataValidation.date_type ?
                                    ("") :
                                    (<span style={{ color: 'red' }}>this field is required</span>)
                            } */}{' '}
                        </Grid>

                        <Grid item="item" lg={4} md={4} sm={12} xs={12}>
                            <SubTitle title="From" />
                            <LoonsDatePicker
                                className="w-full"
                                value={this.state.filterData.from_date}
                                placeholder="From"
                                // minDate={new Date()}

                                //maxDate={new Date()}
                                required={!this.state.date_selection}
                                disabled={this.state.date_selection}
                                errorMessages="this field is required"
                                onChange={(date) => {
                                    let filterData = this.state.filterData
                                    filterData.from_date = date
                                    this.setState({ filterData })
                                }}
                            />
                        </Grid>
                        <Grid item="item" lg={4} md={4} sm={12} xs={12}>
                            <SubTitle title="To" />
                            <LoonsDatePicker
                                className="w-full"
                                value={this.state.filterData.to_date}
                                placeholder="to"
                                // minDate={new Date()}

                                //maxDate={new Date()}
                                required={!this.state.date_selection}
                                disabled={this.state.date_selection}
                                errorMessages="this field is required"
                                onChange={(date) => {
                                    let filterData = this.state.filterData
                                    filterData.to_date = date
                                    this.setState({ filterData })
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
                                alignItems: 'flex-end',
                            }}
                        >
                            <LoonsButton
                                className="mt-2"
                                progress={false}
                                type="submit"
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
                            xs={4}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <TextValidator
                                className="w-full"
                                placeholder="Order ID"
                                fullWidth="fullWidth"
                                variant="outlined"
                                size="small"
                                //value={this.state.formData.search}
                                onChange={(e, value) => {
                                    let filterData = this.state.filterData
                                    if (e.target.value != '') {
                                        filterData.search = e.target.value
                                    } else {
                                        filterData.search = null
                                    }
                                    this.setState({ filterData })
                                    console.log(
                                        'form dat',
                                        this.state.filterData
                                    )
                                }}
                                onKeyPress={(e) => {
                                    if (e.key == 'Enter') {
                                        let filterData = this.state.filterData
                                        filterData.page = 0
                                        this.setState({ filterData })

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
                                data={this.state.data}
                                columns={this.state.columns}
                                options={{
                                    pagination: true,
                                    serverSide: true,
                                    count: this.state.totalItems,
                                    rowsPerPage: 20,
                                    page: this.state.filterData.page,
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
                        )}{' '}
                    </Grid>
                </Grid>
                <Dialog
                    fullWidth="fullWidth"
                    maxWidth="sm"
                    open={this.state.dialog_for_select_warehouse}
                >
                    <MuiDialogTitle disableTypography="disableTypography">
                        <CardTitle title="Select Your Warehouse" />{' '}
                        {/* <IconButton aria-label="close" className={classes.closeButton} onClick={() => { this.setState({ dialog_for_select_warehouse: false }) }}>
                            <CloseIcon />
                        </IconButton>
 */}
                    </MuiDialogTitle>

                    <div className="w-full h-full px-5 py-5">
                        <ValidatorForm
                            //onSubmit={() => this.searchPatients()}
                            onError={() => null}
                            className="w-full"
                        >
                            <Autocomplete
                                        disableClearable
                                className="w-full"
                                // ref={elmRef}
                                options={this.state.all_warehouse_loaded}
                                onChange={(e, value) => {
                                    if (value != null) {
                                        // this.loadRelatedHospitals(value);
                                        this.state.filterData.owner_id =
                                            value.owner_id
                                        this.setState({
                                            owner_id: value.owner_id,
                                            selected_warehouse: value.id,
                                            dialog_for_select_warehouse: false,
                                        })
                                        localStorageService.setItem(
                                            'Selected_Warehouse',
                                            value
                                        )
                                        this.loadData()
                                    }
                                }}
                                value={{
                                    name: this.state.selected_warehouse
                                        ? this.state.all_warehouse_loaded.filter(
                                              (obj) =>
                                                  obj.id ==
                                                  this.state.selected_warehouse
                                          ).name
                                        : null,
                                    id: this.state.selected_warehouse,
                                }}
                                getOptionLabel={(option) => option.name}
                                renderInput={(params) => (
                                    <TextValidator
                                        {...params}
                                        placeholder="Select Your Front Desk"
                                        //variant="outlined"
                                        fullWidth="fullWidth"
                                        variant="outlined"
                                        size="small"
                                    />
                                )}
                            />
                        </ValidatorForm>
                    </div>
                </Dialog>
              </LoonsCard>
            </MainContainer>
        )
    }
}

export default CPAllOrderss
