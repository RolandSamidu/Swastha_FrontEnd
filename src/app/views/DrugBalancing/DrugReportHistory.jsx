//const { Component } = require('react')
import React, { Component, Fragment } from 'react'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import ApartmentIcon from '@material-ui/icons/Apartment'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
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
    Dialog,
    CircularProgress,
    InputAdornment,
    IconButton,
    Icon,
    Tooltip,
    Typography,
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

import DistributionCenterServices from 'app/services/DistributionCenterServices'
import PharmacyOrderService from 'app/services/PharmacyOrderService'
import localStorageService from 'app/services/localStorageService'
import WarehouseServices from 'app/services/WarehouseServices'
import { array, element } from 'prop-types'
import { dateParse } from 'utils'
import { InlineWrapper } from '@material-ui/pickers/wrappers/InlineWrapper'
import { display } from '@mui/system'

const styleSheet = (palette, ...theme) => ({})

class DrugReportHistory extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded: true,
            activeTab: 0,
            activeSecondaryTab: 0,
            Loaded: false,
            selected_warehouse: null,
            owner_id: null,
            dialog_for_select_warehouse: false,
            all_warehouse_loaded: [],
            filterData: {
                limit: 20,
                page: 0,
                from: null,
                to: null,
                warehouse_id: null,
                batch_id: this.props.match.params.id,
                'order[0]': ['updatedAt', 'DESC'],
            },
            totalItems: 0,
            alert: false,
            message: '',
            severity: 'success',

            data: [
                // {
                //     name: 'Amoxillin',
                //     code: '00107902',
                //     batch_number: 'TESTINV0005',
                //     expiry_date: '2022-12-31',
                //     current_balance: '100000',
                //     manual_dispences: ' ',
                //     excess: ' ',
                //     balance_updated: '',
                // },
                // {
                //     name: 'Penicillin',
                //     code: '00107905',
                //     batch_number: 'TESTINV0006',
                //     expiry_date: '2022-10-31',
                //     current_balance: '200000',
                //     manual_dispences: ' ',
                //     excess: ' ',
                //     balance_updated: '',
                // },
            ],
            columns: [

                {
                    name: 'date',
                    label: 'Date',
                    options: {
                        display: true,

                        customBodyRenderLite: (dataIndex) => {
                            let data =this.state.data[dataIndex].createdAt
                            return <p>{dateParse(data)}</p>
                        },
                    },
                },
                {
                    name: 'name',
                    label: 'Name',
                    options: {
                        display: true,

                        customBodyRenderLite: (dataIndex) => {
                            let data =
                                this.state.data[dataIndex].ItemSnapBatchBin?.ItemSnapBatch?.ItemSnap?.medium_description
                            return <p>{data}</p>
                        },
                    },
                },
                {
                    name: 'code',
                    label: 'Code',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data =
                                this.state.data[dataIndex].ItemSnapBatchBin?.ItemSnapBatch?.ItemSnap?.sr_no
                            return <p>{data}</p>
                        },
                    },
                },
                {
                    name: 'batch_number',
                    label: 'Batch No.',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data =
                                this.state.data[dataIndex].ItemSnapBatchBin?.ItemSnapBatch?.batch_no
                            return <p>{data}</p>
                        },
                    },
                },
                {
                    name: 'expiry_date',
                    label: 'ExpiryDate',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data =
                                this.state.data[dataIndex].ItemSnapBatchBin?.ItemSnapBatch?.exd
                            return <p>{dateParse(data)}</p>
                        },
                    },
                },

                {
                    name: 'current_quantity',
                    label: 'Current Balance',
                    options: {
                        display: true,

                    },
                },

                {
                    name: 'opd',
                    label: 'OPD',
                    options: {
                        display: true,
                        // filter: true,

                    },
                },
                {
                    name: 'clinic',
                    label: 'Clinic ',
                    options: {
                        display: true,

                    },
                },
                {
                    name: 'ward',
                    label: 'Ward',
                    options: {
                        display: true,

                    },
                },
                {
                    name: 'excess',
                    label: 'Excess',
                    options: {
                        display: true,

                    },
                },
                {
                    name: 'waste',
                    label: 'Waste',
                    options: {
                        display: true,

                    },
                },

                //     <DataGrid columns ={[{ field: 'username', width: 200 }, { field: 'age' }]}
                //     rows={rows}
                //        />
                // },

                {
                    name: 'balanced_quantity',
                    label: 'Balance(Updated)',
                    options: {
                        display: true,

                    },
                },
                {
                    name: 'remark',
                    label: 'Remark',
                    options: {
                        display: true,

                    },
                },


            ],
        }
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
            let filterData = this.state.filterData

            filterData.warehouse_id = selected_warehouse_cache.id
            console.log('warehouse id', selected_warehouse_cache.id)
            this.setState({
                owner_id: selected_warehouse_cache.owner_id,
                filterData: filterData,
                selected_warehouse: selected_warehouse_cache.id,
                dialog_for_select_warehouse: false,
                warehouseSelectDone: true,
            }, () => {
                this.loadData()
            })
            console.log("selected_warehouse", this.state.selected_warehouse)
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


    async loadData() {
        this.setState({ loaded: false })
        let batch_id = this.props.match.params.id
        let params = this.state.filterData
        let batch_res = await WarehouseServices.getDrugBalancing(params)
        if (batch_res.status == 200) {
            let data = batch_res.data.view.data

            this.setState({
                data: batch_res.data.view.data,
                totalItems: batch_res.data.view.totalItems,
            })
            console.log('Batch Data', this.state.data)
            this.setState({ loaded: true })
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

    //text boxes inpputs
    //  getText() {
    //     const[text,setText]=useState('')

    // }

    componentDidMount() {
        this.loadWarehouses()
        // this.loadData()


    }

    render() {
        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        {/* <CardTitle title="My Orders" /> */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        >
                            {' '}
                            <Typography variant="h6" className="font-semibold">
                                Drug Update
                            </Typography>
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
                                {/* {loaded ? selectedWarehouse.name : 'Chanage Warehouse'} */}
                                Change Warehouse
                            </Button>
                        </div>

                        <Divider className="mb-3 mt-3" />

                        <ValidatorForm
                            onSubmit={() => {
                                this.loadData()
                            }}
                            className="w-full"
                        >
                            <Grid
                                container
                                spacing={1}
                                className="space-between  "
                            >
                                <Grid item lg={4} md={12} sm={6} xs={12}>
                                    <SubTitle title="Search:" />
                                    <TextValidator
                                        className="w-full"
                                        name="search"
                                        InputLabelProps={{ shrink: false }}
                                        value={this.state.filterData.search}
                                        variant="outlined"
                                        size="small"
                                        onChange={(e) => {
                                            let filterData =
                                                this.state.filterData
                                            filterData.search = e.target.value
                                            this.setState({
                                                filterData,
                                            })
                                        }}
                                    />
                                </Grid>
                                <Grid item lg={1} md={4} sm={6} xs={12}>
                                    <Button
                                        className="w-full"
                                        style={{
                                            marginTop: 25,
                                        }}
                                        progress={false}
                                        scrollToTop={false}
                                        type="submit"
                                        startIcon="search"
                                    >
                                        <span className="capitalize">
                                            Search
                                        </span>
                                    </Button>
                                </Grid>
                            </Grid>
                        </ValidatorForm>

                        <Grid container className="mt-4 pb-5">
                            <ValidatorForm
                                onSubmit={() => { }}
                                className="w-full"
                            >
                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                    {this.state.loaded ? (
                                        <>
                                            <LoonsTable
                                                //title={"All Aptitute Tests"}

                                                id={'completed'}
                                                data={this.state.data}
                                                columns={this.state.columns}
                                                options={{
                                                    pagination: true,
                                                    serverSide: true,
                                                    count: this.state
                                                        .totalItems,
                                                    rowsPerPage:
                                                        this.state.filterData
                                                            .limit,
                                                    page: this.state.filterData
                                                        .page,

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
                                        </>
                                    ) : (
                                        //load loading effect
                                        <Grid className="justify-center text-center w-full pt-12">
                                            <CircularProgress size={30} />
                                        </Grid>
                                    )}
                                </Grid>
                            </ValidatorForm>
                        </Grid>
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
                                        let filterData = this.state.filterData
                                        filterData.warehouse_id = value.id
                                        localStorageService.setItem('Selected_Warehouse', value)
                                        this.setState({
                                            owner_id: value.owner_id,
                                            selected_warehouse: value.id,
                                            filterData: filterData,
                                            dialog_for_select_warehouse: false,
                                            Loaded: true,
                                        }, () => { this.loadData() })

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
export default DrugReportHistory
