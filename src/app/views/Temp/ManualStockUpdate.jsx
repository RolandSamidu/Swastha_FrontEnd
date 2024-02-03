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

class ManualStockUpdate extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded: true,
            activeTab: 0,
            activeSecondaryTab: 0,
            Loaded: false,
            selected_warehouse: null,
            selected_warehouse_name: null,
            owner_id: null,
            dialog_for_select_warehouse: false,
            all_warehouse_loaded: [],
            filterData: {
                limit: 20,
                page: 0,
                from: null,
                to: null,
                // orderby_drug: true,
                warehouse_id: null,
                orderby_sr: true
                // 'order[0]': ['updatedAt', 'DESC'],
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
                    name: 'name',
                    label: 'Name',
                    options: {
                        display: true,

                        customBodyRenderLite: (dataIndex) => {
                            let data =
                                this.state.data[dataIndex].ItemSnapBatch
                                    .ItemSnap.medium_description
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
                                this.state.data[dataIndex].ItemSnapBatch
                                    .ItemSnap.sr_no
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
                                this.state.data[dataIndex].ItemSnapBatch
                                    .batch_no
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
                                this.state.data[dataIndex].ItemSnapBatch.exd
                            return <p>{dateParse(data)}</p>
                        },
                    },
                },

                {
                    name: 'current_balance',
                    label: 'Current Balance',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].quantity
                            return <p>{data}</p>
                            // return( onChange={(e) => {
                            //     let data = this.state.data;
                            //     data[dataIndex].opd = e.target.value;
                            //     this.setState({
                            //         data
                            //     })
                        },
                    },
                },

                /* {
                    name: 'opd',
                    label: 'OPD (-)',
                    options: {
                        display: true,
                        // filter: true,

                        customBodyRenderLite: (dataIndex) => {
                            return (
                                <>
                                    <div style={{ width: 100 }}>
                                        <TextValidator
                                            //className=" w-full"
                                            name="opd"
                                            InputLabelProps={{ shrink: false }}
                                            value={
                                                String(parseInt(this.state.data[dataIndex].opd, 10))
                                            }
                                            type="number"
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                let data = this.state.data
                                                if (e.target.value === '') {
                                                    data[dataIndex].opd = 0
                                                } else {
                                                    data[dataIndex].opd =
                                                        parseInt(e.target.value, 10)
                                                }
                                                this.setState({
                                                    data,
                                                })
                                            }}

                                
                                        />
                                    </div>
                                </>
                            )
                        },
                    },
                },
                {
                    name: 'clinic',
                    label: 'Clinic (-)',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            return (
                                <>
                                    <div style={{ width: 100 }}>
                                        <TextValidator
                                            //className=" w-full"

                                            name="clinic"
                                            InputLabelProps={{ shrink: false }}
                                            value={
                                                String(parseInt(this.state.data[dataIndex]
                                                    .clinic, 10))
                                            }
                                            type="number"
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                let data = this.state.data
                                                if (e.target.value === '') {
                                                    data[dataIndex].clinic = 0
                                                }
                                                else {
                                                    data[dataIndex].clinic =
                                                        parseInt(e.target.value, 10)
                                                }
                                                this.setState({
                                                    data,
                                                })
                                            }}
                                        />
                                    </div>
                                </>
                            )
                        },
                    },
                },
                {
                    name: 'ward',
                    label: 'Ward (-)',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            return (
                                <>
                                    <div style={{ width: 100 }}>
                                        <TextValidator
                                            //className=" w-full"

                                            name="ward"
                                            InputLabelProps={{ shrink: false }}
                                            value={
                                                String(parseInt(this.state.data[dataIndex].ward, 10))
                                            }
                                            type="number"
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                let data = this.state.data
                                                if (e.target.value === '') {
                                                    data[dataIndex].ward = 0
                                                } else {
                                                    data[dataIndex].ward =
                                                        parseInt(e.target.value, 10)
                                                }
                                                this.setState({
                                                    data,
                                                })
                                            }}
                                  
                                        />
                                    </div>
                                </>
                            )
                        },
                    },
                }, */
                {
                    name: 'excess',
                    label: 'Additions (+)',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            return (
                                <>
                                    <div style={{ width: 100 }}>
                                        <TextValidator
                                            //className=" w-full"

                                            name="Additions"
                                            InputLabelProps={{ shrink: false }}
                                            value={
                                                String(parseInt(this.state.data[dataIndex]
                                                    .excess, 10))
                                            }
                                            type="number"
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                let data = this.state.data
                                                if (e.target.value === '') {
                                                    data[dataIndex].excess = 0
                                                } else {
                                                    data[dataIndex].excess =
                                                        parseInt(e.target.value, 10)
                                                }
                                                // data[dataIndex].dataIndex =
                                                //     dataIndex

                                                this.setState({
                                                    data
                                                })
                                            }}
                                        /* validators={['matchRegexp:^\s*([0-9a-zA-Z]*)\s*$']}
                            errorMessages={[
                                'Invalid Inputs',
                            ]} */
                                        />
                                    </div>
                                </>
                            )
                        },
                    },
                },
                {
                    name: 'waste',
                    label: 'Deduction (-)',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            return (
                                <>
                                    <div style={{ width: 100 }}>
                                        <TextValidator
                                            //className=" w-full"

                                            name="waste"
                                            InputLabelProps={{ shrink: false }}
                                            value={
                                                String(parseInt(this.state.data[dataIndex].waste, 10))
                                            }
                                            type="number"
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                let data = this.state.data
                                                if (e.target.value === '') {
                                                    data[dataIndex].waste = 0
                                                } else {
                                                    data[dataIndex].waste =
                                                        parseInt(e.target.value, 10)
                                                }
                                                this.setState({
                                                    data,
                                                })
                                            }}
                                        /* validators={['matchRegexp:^\s*([0-9a-zA-Z]*)\s*$']}
                            errorMessages={[
                                'Invalid Inputs',
                            ]} */
                                        />
                                    </div>
                                </>
                            )
                        },
                    },
                },

                //     <DataGrid columns ={[{ field: 'username', width: 200 }, { field: 'age' }]}
                //     rows={rows}
                //        />
                // },

                {
                    name: 'balance_updated',
                    label: 'Balance(Updated)',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let balance_updated =
                                parseInt(this.state.data[dataIndex].quantity) -
                                parseInt(this.state.data[dataIndex].clinic) -
                                parseInt(this.state.data[dataIndex].opd) -
                                parseInt(this.state.data[dataIndex].ward) -
                                parseInt(this.state.data[dataIndex].waste) +
                                parseInt(this.state.data[dataIndex].excess)
                            console.log(balance_updated, 'balance updated')
                            if (isNaN(balance_updated)) {
                                balance_updated = parseInt(
                                    this.state.data[dataIndex].quantity
                                )
                                console.log('balance')
                            }

                            return (
                                <>
                                    <div
                                        style={{
                                            display: 'inline',
                                            width: 300,
                                            flexDirection: 'row',
                                            flexWrap: 'wrap',
                                        }}
                                    >
                                        <center>
                                            <label>{balance_updated}</label>
                                        </center>
                                        {/* <TextValidator
                                            //className=" w-full"
                                            placeholder="0"
                                            name="balance_updated"
                                            InputLabelProps={{
                                                shrink: false,
                                            }}
                                            //value={this.state.formData.phn}
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {}}
                                            
                                        /> */}
                                    </div>
                                </>
                            )
                        },
                    },
                },
                {
                    name: 'remark',
                    label: 'Remark',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            return (
                                <>
                                    <div style={{ width: 100 }}>
                                        <TextValidator
                                            //className=" w-full"

                                            name="remark"
                                            InputLabelProps={{ shrink: false }}
                                            value={
                                                this.state.data[dataIndex].remark
                                            }
                                            // type="number"
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                let data = this.state.data
                                                data[dataIndex].remark =
                                                    e.target.value
                                                this.setState({
                                                    data,
                                                })
                                            }}
                                        /* validators={['matchRegexp:^\s*([0-9a-zA-Z]*)\s*$']}
                            errorMessages={[
                                'Invalid Inputs',
                            ]} */
                                        />
                                    </div>
                                </>
                            )
                        },
                    },
                },
                {
                    name: 'update',
                    label: 'Action',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            return (
                                <Button
                                    onClick={() => {

                                        if (this.state.data[dataIndex].remark == null || this.state.data[dataIndex].remark == "") {
                                            this.setState({
                                                alert: true,
                                                message: 'Please Enter the Remark',
                                                severity: 'error',
                                            })
                                        } else {
                                            this.submit(this.state.data[dataIndex], dataIndex)
                                        }


                                    }}
                                >
                                    Update
                                </Button>
                            )
                        },
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
                selected_warehouse_name: selected_warehouse_cache.name,
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

    async submit(row, dataIndex) {
        let balanced_quantity = parseInt(this.state.data[dataIndex].quantity) -
            parseInt(this.state.data[dataIndex].clinic) -
            parseInt(this.state.data[dataIndex].opd) -
            parseInt(this.state.data[dataIndex].ward) -
            parseInt(this.state.data[dataIndex].waste) +
            parseInt(this.state.data[dataIndex].excess)

        console.log('Submit row', row)
        // const balanced =  balance_updated
        let data = {
            data_index: row.dataIndex,
            item_batch_bin_id: row.id,
            current_quantity: row.quantity,
            opd: row.opd,
            ward: row.ward,
            clinic: row.clinic,
            excess: row.excess,
            waste: row.waste,
            remark: row.remark,
            balanced_quantity:
                (balanced_quantity).toString(), //row.balanced_quantity
            // warehouse_id: row.warehouse_id,
            warehouse_id: this.state.selected_warehouse,
            item_batch_id: row.item_batch_id,
            //new_volume:row.new_volume,
            item_id: row.ItemSnapBatch.ItemSnap.id,
        }
        console.log('submitted data', data)

        if (balanced_quantity >= 0) {
            let res = await WarehouseServices.drugBalancing(data)
            if (res.status == 201) {
                this.setState({
                    alert: true,
                    message: 'Record Updated Successful',
                    severity: 'success',
                })
                //window.location.reload()
                this.loadData()
            } else {
                this.setState({
                    alert: true,
                    message: 'Record Updated Unsuccessful',
                    severity: 'error',
                })
            }
        } else {
            this.setState({
                alert: true,
                message: 'Available Balance Cannot be less than 0',
                severity: 'warning',
            })
        }
    }

    async loadData() {
        this.setState({ loaded: false })
        let params = this.state.filterData
        let batch_res = await DistributionCenterServices.getBatchData(params)
        if (batch_res.status == 200) {
            let data = batch_res.data.view.data
            data.forEach((element, index) => {
                data[index].opd = 0
                data[index].clinic = 0
                data[index].ward = 0
                data[index].excess = 0
                data[index].waste = 0
            })
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
                                Manual Stock Update
                            </Typography>
                            <Grid
                                className='flex'
                            >
                                <Grid
                                    className='pt-1 pr-3'
                                >
                                    <Typography>{this.state.selected_warehouse_name !== null ? "You're in " + this.state.selected_warehouse_name : null}</Typography>
                                </Grid>
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
                            </Grid>
                        </div>

                        <Divider className="mb-3 mt-3" />

                        <ValidatorForm
                            onSubmit={() => {
                                let filterData = this.state.filterData
                                filterData.page = 0
                                this.setState({ filterData }, () => {
                                    this.loadData()
                                })

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
                                options={this.state.all_warehouse_loaded.sort((a, b) => (a.name.localeCompare(b.name)))}
                                onChange={(e, value) => {
                                    if (value != null) {
                                        this.state.owner_id = value.owner_id
                                        let filterData = this.state.filterData
                                        filterData.warehouse_id = value.id
                                        localStorageService.setItem('Selected_Warehouse', value)
                                        this.setState({
                                            owner_id: value.owner_id,
                                            selected_warehouse: value.id,
                                            selected_warehouse_name: value.name,
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
export default ManualStockUpdate
