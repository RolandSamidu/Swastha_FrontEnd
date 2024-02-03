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
import ExchangeReceiveModal from './prescriptionComponents/exchangeReceiveModal'
import ExchangeReceiveByMe from './prescriptionComponents/exchangeReceiveByMe'
import ExchangeAcknowledgeModal from './prescriptionComponents/exchangeAcknowledgeModal'
import ApartmentIcon from '@material-ui/icons/Apartment'
import WarehouseServices from 'app/services/WarehouseServices'
import { dateParse, dateTimeParse } from 'utils'
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

class ExchangeDetails extends Component {
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
                            return this.state.incoming.length > meta.rowIndex
                                ? this.state.incoming[meta.rowIndex]
                                      .request_quantity
                                : '-'
                        },
                    },
                },
                {
                    name: 'IssuedQty',
                    label: 'Issued Qty',
                    options: {
                        display: true,
                        customBodyRender: (val, meta) => {
                            return this.state.incoming[meta.rowIndex]
                                ?.issued_quantity
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
                        customBodyRender: (val, tableMeta) =>
                            this.getIncoming(val, tableMeta),
                    },
                },
            ],
            columns_me: [
                {
                    name: 'id',
                    label: 'Exchange Request ID',
                    options: {
                        display: true,
                        customBodyRender: (val, meta) => {
                            return this.state.outgoing.length > meta.rowIndex
                                ? this.state.outgoing[meta.rowIndex]
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
                            return this.state.outgoing.length > meta.rowIndex
                                ? dateParse(
                                      this.state.outgoing[meta.rowIndex]
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
                            return this.state.outgoing.length > meta.rowIndex
                                ? this.state.outgoing[meta.rowIndex].ItemSnap
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
                            return this.state.outgoing.length > meta.rowIndex
                                ? this.state.outgoing[meta.rowIndex]
                                      .request_quantity
                                : '-'
                        },
                    },
                },
                {
                    name: 'issued_quantity',
                    label: 'Issued Qty',
                    options: {
                        display: true,
                        customBodyRender: (val, meta) => {
                            return this.state.outgoing.length > meta.rowIndex
                                ? this.state.outgoing[meta.rowIndex]
                                      .issued_quantity
                                : '-'
                        },
                    },
                },
                {
                    name: 'requestedFrom',
                    label: 'Requested To',
                    options: {
                        display: true,
                        customBodyRender: (val, meta) => {
                            return this.state.outgoing[meta.rowIndex]
                                ?.OrderExchange?.toStore?.name
                        },
                    },
                },

                {
                    name: 'my_stock',
                    label: 'My Present Stock',
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
                    name: 'fulfilDate',
                    label: 'Fulfilment Date',
                    options: {
                        display: true,
                        customBodyRender: (val, meta) => {
                            return this.state.outgoing.length > meta.rowIndex
                                ? dateParse(
                                      this.state.outgoing[meta.rowIndex]
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
                    name: 'actions',
                    label: 'Actions',
                    options: {
                        display: true,
                        customBodyRender: (val, tableMeta) =>
                            this.getOutgoing(val, tableMeta),
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
                exchange_type: 'EXCHANGE',
                limit: 10,
                page: 0,
                date_type: 'REQUESTED DATE',
            },
            outgoingFilters: {
                from: null,
                'order[0]': ['updatedAt', 'DESC'],
                exchange_type: 'EXCHANGE',
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

    fetchOutgoingExchanges() {
        var warehouse = this.state.selected_warehouse.warehouse.id
        var pharmacy =
            this.state.selected_warehouse.warehouse.pharmacy_drugs_store_id

        let outgoingFilters = this.state.outgoingFilters
        outgoingFilters.from = warehouse
        this.setState({ outgoingLoaded: false })

        WarehouseServices.getDrugExchanges(outgoingFilters).then(
            async (exc) => {
                const outgoing = exc.data ? exc.data.view.data : []
                console.log('outgoing', exc)
                const stock_out = await PharmacyService.getDrugStocks({
                    warehouse_id: warehouse,
                    items: outgoing.map((itm) => itm.ItemSnap.id),
                    zero_needed: true,
                    main_needed: true,
                    pharmacy_drugs_store_id: pharmacy,
                })
                console.log('outstock out', stock_out)
                const mixedOut = outgoing.map((out) => {
                    const itm = stock_out.data.posted.data.filter(
                        (st) => out?.item_id === st?.ItemSnap?.id
                    )
                    if (itm.length > 0) {
                        out.my_stock = itm[0].quantity
                    } else {
                        out.my_stock = 0
                    }
                    return out
                })
                console.log('outstock out print', mixedOut)
                this.setState({
                    outgoing: mixedOut,
                    outgoingTotal: exc.data.view.totalItems,
                    warehouse,
                    pharmacy,
                    outgoingLoaded: true,
                })
            }
        )
    }

    fetchIncommingExchanges() {
        var warehouse = this.state.selected_warehouse.warehouse.id
        var pharmacy =
            this.state.selected_warehouse.warehouse.pharmacy_drugs_store_id

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
        console.log('This is value', val)
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

    async setGoingPage(page) {
        let outgoingFilters = this.state.outgoingFilters
        outgoingFilters.page = page
        this.setState(
            {
                outgoingFilters,
            },
            () => {
                this.fetchOutgoingExchanges()
            }
        )
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
                    this.fetchOutgoingExchanges()
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
            issuance_type: 'pharmacy',
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
                    <LoonsCard>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Typography variant="h6" className="font-semibold">
                                Exchange Details
                            </Typography>
                            <div className="flex">
                                <Button
                                    color="primary"
                                    onClick={() => {
                                        this.setState({
                                            dialog_for_select_warehouse: true,
                                            Loaded: false,
                                        })
                                    }}
                                >
                                    <ApartmentIcon />
                                    Change Warehouses
                                </Button>
                            </div>
                        </div>
                        <Divider className="mb-3" />
                        <ValidatorForm
                            className={classes.padded}
                            onSubmit={() => {
                                this.fetchIncommingExchanges()
                                this.fetchOutgoingExchanges()
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    marginBottom: '1rem',
                                }}
                            >
                                <div
                                    onClick={() => {
                                        this.setState({ selected: 0 })
                                    }}
                                    className={
                                        this.state.selected === 0
                                            ? classes.centeredSelected
                                            : classes.centeredIdle
                                    }
                                >
                                    <p className={classes.centerTab}>
                                        Request from Others
                                    </p>
                                </div>
                                <div
                                    onClick={() => {
                                        this.setState({ selected: 1 })
                                    }}
                                    className={
                                        this.state.selected === 1
                                            ? classes.centeredSelected
                                            : classes.centeredIdle
                                    }
                                >
                                    <p className={classes.centerTab}>
                                        Requested by Me
                                    </p>
                                </div>
                            </div>
                            <Grid container spacing={2}>
                                <Grid item xs={3}>
                                    <LabeledInput
                                        label="Exchange ID"
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
                                        minDate={this.state.incommingFilters
                                            .from_date}
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
                                        options={
                                            this.state.selected === 1
                                                ? [
                                                      {
                                                          label: 'Issued',
                                                          value: 'Issued',
                                                      },
                                                      {
                                                          label: 'Pending',
                                                          value: 'Pending',
                                                      },
                                                      {
                                                          label: 'Discarded',
                                                          value: 'Discarded',
                                                      },
                                                  ]
                                                : [
                                                      {
                                                          label: 'Requested',
                                                          value: 'Requested',
                                                      },
                                                      {
                                                          label: 'Offered',
                                                          value: 'Offered',
                                                      },
                                                      {
                                                          label: 'Rejected',
                                                          value: 'Rejected',
                                                      },
                                                      {
                                                          label: 'Returned',
                                                          value: 'Returned',
                                                      },
                                                      {
                                                          label: 'Return Accepted',
                                                          value: 'Return Accepted',
                                                      },
                                                  ]
                                        }
                                        getOptionLabel={(option) =>
                                            option.label != null
                                                ? option.label
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

                        {this.state.selected === 0 ? (
                            this.state.incommngLoaded ? (
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
                                <CircularProgress size={15} color="primary" />
                            )
                        ) : this.state.outgoingLoaded ? (
                            <LoonsTable
                                id={'exchangeDetails'}
                                data={this.state.outgoing}
                                columns={this.state.columns_me}
                                options={{
                                    pagination: true,
                                    serverSide: true,
                                    count: this.state.outgoingTotal,
                                    rowsPerPage: 10,
                                    page: this.state.outgoingFilters.page,
                                    onTableChange: (action, tableState) => {
                                        console.log(action, tableState)
                                        switch (action) {
                                            case 'changePage':
                                                this.setGoingPage(
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
                            <CircularProgress size={15} color="primary" />
                        )}
                    </LoonsCard>

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
                {this.state.receive ? (
                    <ExchangeReceiveModal
                        setOpen={(res) => this.setState({ receive: res })}
                        open={this.state.receive}
                        warehouse={this.state.warehouse}
                        pharmacy={this.state.pharmacy}
                    />
                ) : null}
                {this.state.acknowledgement ? (
                    <ExchangeAcknowledgeModal
                        setOpen={(res) =>
                            this.setState({ acknowledgement: res })
                        }
                        open={this.state.acknowledgement}
                    />
                ) : null}
                {this.state.receiveByMe ? (
                    <ExchangeReceiveByMe
                        setOpen={(res) => this.setState({ receiveByMe: res })}
                        open={this.state.receiveByMe}
                        warehouse={this.state.warehouse}
                        pharmacy={this.state.pharmacy}
                    />
                ) : null}

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
                                                this.fetchOutgoingExchanges()
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

export default withStyles(styleSheet)(ExchangeDetails)
