import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/styles'
import {
    LoonsTable,
    MainContainer,
    Summary,
    Widget,
    LoonsCard,
    CardTitle,
    Button,
    SubTitle,
    DatePicker,
} from 'app/components/LoonsLabComponents'
import {
    Dialog,
    DialogActions,
    DialogContentText,
    Grid,
    TextareaAutosize,
    Divider,
    Typography,
    CircularProgress,
    TextField,
    Icon,
    IconButton,
} from '@material-ui/core'
import LabeledInput from 'app/components/LoonsLabComponents/LabeledInput'
import { Autocomplete, createFilterOptions } from '@material-ui/lab'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import CloseIcon from '@material-ui/icons/Close'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import ScreenShareIcon from '@material-ui/icons/ScreenShare'
import PauseIcon from '@material-ui/icons/Pause'
import SendIcon from '@material-ui/icons/Send'
import LoonsButton from 'app/components/LoonsLabComponents/Button'
import ApartmentIcon from '@material-ui/icons/Apartment'
import WarehouseServices from 'app/services/WarehouseServices'
import { dateParse, dateTimeParse, roundDecimal } from 'utils'
import PharmacyService from 'app/services/PharmacyService'
import localStorageService from 'app/services/localStorageService'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import CallReceivedIcon from '@material-ui/icons/CallReceived'

const styleSheet = (palette, ...theme) => ({
    padded: {
        paddingTop: '20px',
        paddingBottom: '20px',
    },
    centered: {
        justifyContent: 'center',
        flex: 1,
    },
    centeredIdle: {
        justifyContent: 'center',
        flex: 1,
        cursor: 'pointer',
        border: '1px solid #E5E5E5',
    },
    centeredSelected: {
        justifyContent: 'center',
        flex: 1,
        cursor: 'pointer',
        borderLeft: '1px solid #E5E5E5',
        borderRight: '1px solid #E5E5E5',
        borderTop: '1px solid #E5E5E5',
        background: '#F5F5F5',
    },
    filled: {
        width: '100%',
    },
    centerTab: {
        textAlign: 'center',
        padding: '0.5rem',
    },
})

class ItemWiseOrders extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selected: 0,
            loaded: false,

            selected_warehouse: null,
            owner_id: null,
            dialog_for_select_warehouse: false,
            all_warehouse_loaded: [],
            pharmacy_data: [],

            columns_others: [
                {
                    name: 'id',
                    label: 'Exchange Request ID',
                    options: {
                        display: true,
                        customBodyRender: (val, meta) => {
                            return this.state.incoming.length > meta.rowIndex
                                ? this.state.incoming[meta.rowIndex]
                                    .OrderExchange.order_id
                                : '-'
                        },
                    },
                },
                {
                    name: 'initTime',
                    label: 'Initialization Time',
                    options: {
                        display: true,
                        customBodyRender: (val, meta) => {
                            return this.state.incoming.length > meta.rowIndex
                                ? dateParse(
                                    this.state.incoming[meta.rowIndex]
                                        .createdAt
                                )
                                : '-'
                        },
                    },
                },
                {
                    name: 'itemName',
                    label: 'Item Name',
                    options: {
                        display: true,
                        customBodyRender: (val, meta) => {
                            return this.state.incoming.length > meta.rowIndex
                                ? this.state.incoming[meta.rowIndex].ItemSnap
                                    .medium_description
                                : '-'
                        },
                    },
                },
                {
                    name: 'requestedQty',
                    label: 'Requested Qty',
                    options: {
                        display: true,
                        customBodyRender: (val, meta) => {
                            // console.log('cheking table data', )

                            if (this.state.incoming[meta.rowIndex]?.ItemSnap?.converted_order_uom === 'EU') {
                                return this.state.incoming.length > meta.rowIndex ? roundDecimal(this.state.incoming[meta.rowIndex].request_quantity * this.state.incoming[meta.rowIndex]?.ItemSnap?.item_unit_size, 2) + ' ' + this.state.incoming[meta.rowIndex]?.ItemSnap?.DisplayUnit : '-'
                            } else {
                                return this.state.incoming.length > meta.rowIndex ? this.state.incoming[meta.rowIndex]?.request_quantity : '-'
                            }

                        },
                    },
                },
                {
                    name: 'OrderExchange',
                    label: 'Requested By',
                    options: {
                        display: true,
                        customBodyRender: (val, meta) => {
                            return this.state.incoming[meta.rowIndex]
                                ?.OrderExchange?.fromStore?.name
                        },
                    },
                },

                {
                    name: 'my_stock',
                    label: 'My Present Stock',
                    options: {
                        display: true,
                        customBodyRender: (val, meta) => {

                            // if (this.state.incoming[meta.rowIndex]?.ItemSnap?.converted_order_uom === 'EU'){
                            //     return roundDecimal(this.state.incoming[meta.rowIndex]?.my_stock * this.state.incoming[meta.rowIndex]?.ItemSnap?.item_unit_size, 2) + ' ' + this.state.incoming[meta.rowIndex]?.ItemSnap?.DisplayUnit
                            // } else {
                            return this.state.incoming[meta.rowIndex]?.my_stock
                            // }

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
                    name: 'fulfilDate',
                    label: 'Fulfilment Date',
                    options: {
                        display: true,
                        customBodyRender: (val, meta) => {
                            return this.state.incoming.length > meta.rowIndex
                                ? dateParse(
                                    this.state.incoming[meta.rowIndex]
                                        ?.OrderExchange?.approved_date
                                ) ?? '-'
                                : '-'
                        },
                    },
                },
                // {
                //     name: 'qty',
                //     label: 'Qty',
                //     options: {
                //         display: true,
                //     },
                // },
                {
                    name: 'status',
                    label: 'Actions',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <IconButton
                                    // className="text-black"
                                    onClick={() => {
                                        //let id=this.state.outgoing[tableMeta.rowIndex].order_exchange_id;
                                        console.log(
                                            'aaaaaa',
                                            this.state.incoming[
                                                tableMeta.rowIndex
                                            ].order_exchange_id
                                        )

                                        window.location = `/msa_all_order/all-orders/order/${this.state.incoming[
                                                tableMeta.rowIndex
                                            ].order_exchange_id
                                            }/${this.state.incoming[
                                                tableMeta.rowIndex
                                            ]?.OrderExchange?.number_of_items
                                            }/${this.state.incoming[
                                                tableMeta.rowIndex
                                            ]?.OrderExchange?.order_id
                                            }/${this.state.incoming[
                                                tableMeta.rowIndex
                                            ].OrderExchange?.Employee.name
                                            }/${this.state.incoming[
                                                tableMeta.rowIndex
                                            ].OrderExchange?.Employee
                                                ?.contact_no
                                            }/${this.state.incoming[
                                                tableMeta.rowIndex
                                            ].OrderExchange?.status
                                            }/${this.state.incoming[
                                                tableMeta.rowIndex
                                            ].OrderExchange?.type
                                            }`
                                    }}
                                >
                                    <Icon color="primary">visibility</Icon>
                                </IconButton>
                            )
                        },
                    },
                },
            ],

            data: [],
            discard: false,
            receive: false,
            receiveByMe: false,
            acknowledgement: null,
            outgoing: [],
            incoming: [],
            exTxt: '',
            exPoint: null,
            exDate: '',
            exStatus: '',
            warehouse: null,
            pharmacy: null,
            incommingFilters: {
                to: null,
                'order[0]': ['updatedAt', 'DESC'],
                exchange_type: this.props.type,
                limit: 10,
                page: 0,
                date_type: 'REQUESTED DATE',
            },

            incommingTotal: null,
            outgoingTotal: null,
            incommngLoaded: false,
            outgoingLoaded: false,
        }
    }

    fetchIncommingExchanges() {
        var warehouse = this.state.selected_warehouse.id
        var pharmacy =
            this.state.selected_warehouse.pharmacy_drugs_store_id

        let incommingFilters = this.state.incommingFilters
        incommingFilters.to = warehouse

        this.setState({ incommngLoaded: false })
        WarehouseServices.getDrugExchanges(incommingFilters).then(
            async (exc) => {
                const incoming = exc.data ? exc.data.view.data : []
                console.log('incoming', exc.data.view)
                const stock_out = await PharmacyService.getDrugStocks({
                    warehouse_id: warehouse,
                    items: incoming.map((itm) => itm.ItemSnap.id),
                    zero_needed: true,
                    main_needed: true,
                    pharmacy_drugs_store_id: pharmacy,
                })
                const mixedIn = incoming.map((out) => {
                    const itm = stock_out.data.posted.data.filter(
                        (st) => st.item_id === out.ItemSnap.id
                    )
                    if (itm.length > 0) {
                        out.my_stock = itm[0].quantity
                    } else {
                        out.my_stock = 0
                    }
                    return out
                })
                console.log('instock out', stock_out)
                this.setState({
                    incoming: mixedIn,
                    incommingTotal: exc.data.view.totalItems,
                    warehouse,
                    pharmacy,
                    incommngLoaded: true,
                })
            }
        )
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.show !== prevState.show) {
            console.log('Do something')
        }
    }

    getIncoming(val, meta) {
        return this.state.incoming.length > meta.rowIndex &&
            val == 'ORDERED' ? (
            <div style={{ display: 'flex' }}>
                <div
                    onClick={() =>
                        this.setState({
                            receive: this.state.incoming[meta.rowIndex],
                        })
                    }
                >
                    <SendIcon style={{ color: '#00efa7' }} />
                </div>
            </div>
        ) : null
    }

    getOutgoing(val, meta) {
        return this.state.outgoing.length > meta.rowIndex ? (
            <div style={{ display: 'flex' }}>
                {this.state.outgoing[meta.rowIndex].status === 'ORDERED' ? (
                    <div onClick={() => this.setState({ discard: true })}>
                        <CloseIcon style={{ color: '#ff005d' }} />
                    </div>
                ) : null}
                {this.state.outgoing[meta.rowIndex].status === 'ORDERED' ? (
                    <div
                        onClick={() =>
                            this.setState({
                                acknowledgement:
                                    this.state.outgoing[meta.rowIndex],
                            })
                        }
                    >
                        <PauseIcon style={{ color: '#00cbff' }} />
                    </div>
                ) : null}

                {this.state.outgoing[meta.rowIndex].status === 'ISSUED' ? (
                    <div
                        onClick={() =>
                            this.setState({
                                receiveByMe: this.state.outgoing[meta.rowIndex],
                            })
                        }
                    >
                        <CallReceivedIcon style={{ color: '#ff005d' }} />
                    </div>
                ) : null}
            </div>
        ) : null
    }

    async receiveItem() {
        let formData = {
            order_item_id: '836e37fd-5c09-4c52-854d-32879566161c',
            order_exchange_id: '44d85899-d6e4-4d6f-aca8-ae665c6adb85',
            remark_by: '5edcfaf2-5af8-460c-8912-3005beec8174',
            activity: 'EXCHANGE RECEIVED',
            type: 'EXCHANGE RECEIVED',
            volume: 5,
            quantity: 72,
            warehouse_id: '5313e524-28a6-4647-90a5-49b80d91f85a',
            item_batch_id: '5cb15cdd-99bc-441e-8901-af5a8a350879',
            bin_id: '19e90509-fa3a-416a-9b3e-d7fe40b6278b',
            date: '2022-10-10',
        }
    }

    async setIncommingPage(page) {
        let incommingFilters = this.state.incommingFilters
        incommingFilters.page = page
        this.setState(
            {
                incommingFilters,
            },
            () => {
                this.fetchIncommingExchanges()
            }
        )
    }

    async loadWarehouses() {
        this.setState({ Loaded: false })
        var user = await localStorageService.getItem('userInfo')
        console.log('user', user)
        var id = user.id
        var all_pharmacy_dummy = []
        var selected_warehouse_cache = await localStorageService.getItem(
            'Selected_Warehouse'
        )
        if (!selected_warehouse_cache) {
            this.setState({ dialog_for_select_warehouse: true })
        } else {
            // this.state.genOrder.created_by = id
            // this.state.genOrder.warehouse_id = selected_warehouse_cache.id
            // this.state.getCartItems.warehouse_id = selected_warehouse_cache.id
            // this.state.suggestedWareHouses.warehouse_id = selected_warehouse_cache.id
            // this.state.formData.owner_id = selected_warehouse_cache.owner_id
            this.setState(
                {
                    owner_id: selected_warehouse_cache.owner_id,
                    selected_warehouse: selected_warehouse_cache,
                    dialog_for_select_warehouse: false,
                    warehouseSelectDone: true,
                },
                () => {
                    this.fetchIncommingExchanges()
                }
            )
            console.log(this.state.selected_warehouse)
        }
        let params = { employee_id: id }
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
            this.setState({
                all_warehouse_loaded: all_pharmacy_dummy,
                Loaded: true,
            })
        }
    }

    async loadPharmacy() {
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
            })
        }
    }

    componentDidMount() {
        this.loadPharmacy()
        this.loadWarehouses()
    }

    render() {
        const { classes } = this.props
        return (
            <Fragment>
                <MainContainer>
                    <div>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        >
                            {/*  <Typography variant="h6" className="font-semibold">Exchange Details</Typography>
                             */}
                        </div>
                        <Divider className="mb-3" />
                        <ValidatorForm
                            className={classes.padded}
                            onSubmit={() => {
                                this.fetchIncommingExchanges()
                            }}
                        >
                            <Grid container spacing={2}>
                                <Grid item xs={3}>
                                    <LabeledInput
                                        label="Order ID"
                                        inputType="text"
                                        onUpdate={(e) => {
                                            let incommingFilters =
                                                this.state.incommingFilters
                                            let outgoingFilters =
                                                this.state.outgoingFilters
                                            incommingFilters.order_id =
                                                e.target.value
                                            outgoingFilters.order_id =
                                                e.target.value
                                            this.setState({
                                                incommingFilters,
                                                outgoingFilters,
                                            })
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={3}>
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
                                                    this.state.incommingFilters
                                                let outgoingFilters =
                                                    this.state.outgoingFilters
                                                incommingFilters.from = null
                                                outgoingFilters.to = null
                                                this.setState({
                                                    incommingFilters,
                                                    outgoingFilters,
                                                })
                                            } else {
                                                let incommingFilters =
                                                    this.state.incommingFilters
                                                let outgoingFilters =
                                                    this.state.outgoingFilters
                                                incommingFilters.from = value.id
                                                outgoingFilters.to = value.id
                                                this.setState({
                                                    incommingFilters,
                                                    outgoingFilters,
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

                                <Grid item xs={3}>
                                    <SubTitle title="Requested From Date" />
                                    <DatePicker
                                        className="w-full"
                                        value={
                                            this.state.incommingFilters
                                                .from_date
                                        }
                                        placeholder="Date From"
                                        // minDate={new Date()}
                                        // maxDate={new Date()}
                                        // required={true}
                                        // errorMessages="this field is required"
                                        onChange={(date) => {
                                            if (date == null) {
                                                let incommingFilters =
                                                    this.state.incommingFilters
                                                let outgoingFilters =
                                                    this.state.outgoingFilters
                                                incommingFilters.from_date =
                                                    null
                                                outgoingFilters.from_date = null
                                                this.setState({
                                                    incommingFilters,
                                                    outgoingFilters,
                                                })
                                            } else {
                                                let incommingFilters =
                                                    this.state.incommingFilters
                                                let outgoingFilters =
                                                    this.state.outgoingFilters
                                                incommingFilters.from_date =
                                                    dateParse(date)
                                                outgoingFilters.from_date =
                                                    dateParse(date)
                                                this.setState({
                                                    incommingFilters,
                                                    outgoingFilters,
                                                })
                                            }
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={3}>
                                    <SubTitle title="Requested to Date" />
                                    <DatePicker
                                        className="w-full"
                                        value={
                                            this.state.incommingFilters.to_date
                                        }
                                        placeholder="Date To"
                                        // minDate={new Date()}
                                        // maxDate={new Date()}
                                        // required={true}
                                        // errorMessages="this field is required"
                                        onChange={(date) => {
                                            if (date == null) {
                                                let incommingFilters =
                                                    this.state.incommingFilters
                                                let outgoingFilters =
                                                    this.state.outgoingFilters
                                                incommingFilters.to_date = null
                                                outgoingFilters.to_date = null
                                                this.setState({
                                                    incommingFilters,
                                                    outgoingFilters,
                                                })
                                            } else {
                                                let incommingFilters =
                                                    this.state.incommingFilters
                                                let outgoingFilters =
                                                    this.state.outgoingFilters
                                                incommingFilters.to_date =
                                                    dateParse(date)
                                                outgoingFilters.to_date =
                                                    dateParse(date)
                                                this.setState({
                                                    incommingFilters,
                                                    outgoingFilters,
                                                })
                                            }
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={3}>
                                    <SubTitle title="Status" />
                                    <Autocomplete
                                        disableClearable
                                        className="w-full"
                                        options={[
                                            { value: 'ORDERED' },
                                            { value: 'APPROVED' },
                                            { value: 'REJECTED' },
                                            { value: 'ISSUED' },
                                            { value: 'RECEIVED' },
                                            { value: 'COMPLETED' },
                                            { value: 'Pending' },
                                        ]}
                                        getOptionLabel={(option) =>
                                            option.value != null
                                                ? option.value
                                                : null
                                        }
                                        onChange={(e, value) => {
                                            if (value == null) {
                                                let incommingFilters =
                                                    this.state.incommingFilters
                                                let outgoingFilters =
                                                    this.state.outgoingFilters
                                                incommingFilters.status = null
                                                outgoingFilters.status = null
                                                this.setState({
                                                    incommingFilters,
                                                    outgoingFilters,
                                                })
                                            } else {
                                                let incommingFilters =
                                                    this.state.incommingFilters
                                                let outgoingFilters =
                                                    this.state.outgoingFilters
                                                incommingFilters.status =
                                                    value.value
                                                outgoingFilters.status =
                                                    value.value
                                                this.setState({
                                                    incommingFilters,
                                                    outgoingFilters,
                                                })
                                            }
                                        }}
                                        //value={this.state.pharmacy_data.find((obj) => obj.id == this.state.incommingFilters.)}

                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                placeholder="Status"
                                                //variant="outlined"
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={3}>
                                    <LabeledInput
                                        label="Search"
                                        inputType="text"
                                        onUpdate={(e) => {
                                            let incommingFilters =
                                                this.state.incommingFilters
                                            let outgoingFilters =
                                                this.state.outgoingFilters
                                            incommingFilters.search =
                                                e.target.value
                                            outgoingFilters.search =
                                                e.target.value
                                            this.setState({
                                                outgoingFilters,
                                            })
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <Button
                                        style={{ marginTop: 26 }}
                                        type="submit"
                                    >
                                        Search
                                    </Button>
                                </Grid>
                            </Grid>
                        </ValidatorForm>

                        {this.state.incommngLoaded ? (
                            <LoonsTable
                                id={'exchangeDetails'}
                                data={this.state.incoming}
                                columns={this.state.columns_others}
                                options={{
                                    pagination: true,
                                    serverSide: true,
                                    count: this.state.incommingTotal,
                                    rowsPerPage: 10,
                                    page: this.state.incommingFilters.page,
                                    onTableChange: (action, tableState) => {
                                        console.log(action, tableState)
                                        switch (action) {
                                            case 'changePage':
                                                this.setIncommingPage(
                                                    tableState.page
                                                )
                                                break
                                            case 'sort':
                                                //this.sort(tableState.page, tableState.sortOrder);
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
                            <div className="w-full items-center justify-center align-middle">
                                <CircularProgress size={15} color="primary" />
                            </div>
                        )}
                    </div>

                    <Dialog
                        open={this.state.discard}
                        onClose={() => this.setState({ discard: false })}
                    >
                        <div style={{ padding: '1.5rem' }}>
                            <DialogContentText>
                                You are about to discard the Request!
                                <br />
                                Please state a valid reason in order to discard
                                the exchange.
                            </DialogContentText>
                            <TextareaAutosize
                                aria-label="Description"
                                placeholder="Description"
                                style={{ width: '100%', minHeight: '5rem' }}
                            />
                        </div>
                        <DialogActions>
                            <Button
                                size="small"
                                variant="contained"
                                style={{
                                    background: '#00cbff',
                                    color: 'white',
                                }}
                            >
                                Confirm and Discard
                            </Button>
                            <Button
                                size="small"
                                variant="contained"
                                style={{
                                    background: '#ff005d',
                                    color: 'white',
                                }}
                                onClick={() =>
                                    this.setState({ discard: false })
                                }
                            >
                                Cancel Action
                            </Button>
                        </DialogActions>
                    </Dialog>
                </MainContainer>

                <Dialog
                    fullWidth
                    maxWidth="sm"
                    open={this.state.dialog_for_select_warehouse}
                >
                    <MuiDialogTitle disableTypography>
                        <CardTitle title="Select Your Warehouse" />
                    </MuiDialogTitle>

                    <div className="w-full h-full px-5 py-5">
                        <ValidatorForm onError={() => null} className="w-full">
                            <Autocomplete
                                disableClearable
                                className="w-full"
                                options={this.state.all_warehouse_loaded}
                                onChange={(e, value) => {
                                    if (value != null) {
                                        this.state.owner_id = value.owner_id
                                        this.setState(
                                            {
                                                owner_id: value.owner_id,
                                                selected_warehouse: value,
                                                dialog_for_select_warehouse: false,
                                                Loaded: true,
                                            },
                                            () => {
                                                console.log(
                                                    'selecting warehouse',
                                                    value
                                                )
                                                localStorageService.setItem(
                                                    'Selected_Warehouse',
                                                    value
                                                )
                                                this.fetchIncommingExchanges()
                                            }
                                        )

                                        // this.loadData()
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
                                getOptionLabel={(option) =>
                                    option.name != null
                                        ? option.name +
                                        ' - ' +
                                        option.main_or_personal
                                        : null
                                }
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
            </Fragment>
        )
    }
}

export default withStyles(styleSheet)(ItemWiseOrders)
